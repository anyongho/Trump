import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import { storage } from "./storage";
import { parseExcelFile } from "./excel-parser";
import * as fs from "fs";
import * as path from "path";

const app = express();

declare module 'http' {
  interface IncomingMessage {
    rawBody: unknown
  }
}

app.use(express.json({
  verify: (req, _res, buf) => {
    req.rawBody = buf;
  }
}));
app.use(express.urlencoded({ extended: false }));

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

(async () => {
  // Auto-load merged_all_excel.xlsx on startup
  const excelFilePath = path.join(process.cwd(), 'merged_all_excel.xlsx');
  
  try {
    if (fs.existsSync(excelFilePath)) {
      log('Loading data from merged_all_excel.xlsx...');
      const buffer = fs.readFileSync(excelFilePath);
      const result = parseExcelFile(buffer);
      
      if (result.tweets.length > 0) {
	const tweets = result.tweets.map(tweet => ({
    ...tweet,
    impact_on_market: tweet.impact_on_market ?? tweet.impactonmarket ?? '없음', // 통일
  }));
        await storage.setTweets(tweets);
        await storage.setMetadata({
          filename: 'merged_all_excel.xlsx',
          uploadedAt: new Date().toISOString(),
          totalTweets: result.tweets.length,
        });
        log(`Successfully loaded ${result.tweets.length} tweets from merged_all_excel.xlsx`);
        
        if (result.errors.length > 0) {
          log(`Warning: ${result.errors.length} rows had errors during parsing`);
        }
      } else {
        log('Warning: No valid tweets found in merged_all_excel.xlsx');
      }
    } else {
      log('Warning: merged_all_excel.xlsx not found in project root');
    }
  } catch (error) {
    log(`Error loading merged_all_excel.xlsx: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }

  const server = await registerRoutes(app);

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ message });
    throw err;
  });

  // Setup Vite in development
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  // Start server on Windows-compatible localhost
  const port = parseInt(process.env.PORT || '5000', 10);
  server.listen(port, () => {
    log(`Server running at http://localhost:${port}`);
  });
})();