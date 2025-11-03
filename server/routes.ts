import type { Express } from "express";
import { createServer, type Server } from "http";
import multer from "multer";
import { storage } from "./storage";
import { parseExcelFile } from "./excel-parser";
import { filterSchema } from "@shared/schema";
import { z } from "zod";

// Configure multer for file uploads (store in memory)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
        file.mimetype === 'application/vnd.ms-excel' ||
        file.originalname.endsWith('.xlsx') ||
        file.originalname.endsWith('.xls')) {
      cb(null, true);
    } else {
      cb(new Error('Only Excel files (.xlsx, .xls) are allowed'));
    }
  },
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Get all tweets
  app.get('/api/tweets', async (req, res) => {
    try {
      const tweets = await storage.getAllTweets();
      res.json(tweets);
    } catch (error) {
      console.error('Error fetching tweets:', error);
      res.status(500).json({ error: 'Failed to fetch tweets' });
    }
  });

  // Get filtered tweets
  app.get('/api/tweets/filter', async (req, res) => {
    try {
      // Parse query parameters
      const filter: any = {};
      
      if (req.query.dateFrom) filter.dateFrom = String(req.query.dateFrom);
      if (req.query.dateTo) filter.dateTo = String(req.query.dateTo);
      if (req.query.sentimentMin) filter.sentimentMin = parseFloat(String(req.query.sentimentMin));
      if (req.query.sentimentMax) filter.sentimentMax = parseFloat(String(req.query.sentimentMax));
      if (req.query.impactCategory) {
        filter.impactCategory = Array.isArray(req.query.impactCategory) 
          ? req.query.impactCategory 
          : [req.query.impactCategory];
      }
      if (req.query.sectors) {
        filter.sectors = Array.isArray(req.query.sectors) 
          ? req.query.sectors 
          : [req.query.sectors];
      }
      if (req.query.keywords) {
        filter.keywords = Array.isArray(req.query.keywords) 
          ? req.query.keywords 
          : [req.query.keywords];
      }
      if (req.query.searchText) filter.searchText = String(req.query.searchText);

      // Validate filter
      const validatedFilter = filterSchema.parse(filter);
      
      const tweets = await storage.filterTweets(validatedFilter);
      res.json(tweets);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: 'Invalid filter parameters', details: error.errors });
      } else {
        console.error('Error filtering tweets:', error);
        res.status(500).json({ error: 'Failed to filter tweets' });
      }
    }
  });

  // Upload Excel file
  app.post('/api/upload', upload.single('file'), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
      }

      // Parse the Excel file
      const result = parseExcelFile(req.file.buffer);

      if (result.tweets.length === 0) {
        return res.status(400).json({ 
          error: 'No valid tweets found in Excel file',
          details: result.errors 
        });
      }

      // Store the tweets
      await storage.setTweets(result.tweets);

      // Store metadata
      await storage.setMetadata({
        filename: req.file.originalname,
        uploadedAt: new Date().toISOString(),
        totalTweets: result.tweets.length,
      });

      res.json({
        success: true,
        totalTweets: result.tweets.length,
        totalRows: result.totalRows,
        errors: result.errors.length > 0 ? result.errors : undefined,
      });
    } catch (error) {
      console.error('Error uploading file:', error);
      res.status(500).json({ 
        error: error instanceof Error ? error.message : 'Failed to upload file' 
      });
    }
  });

  // Refresh data (reload from stored data - useful for manual refresh button)
  app.post('/api/refresh', async (req, res) => {
    try {
      const metadata = await storage.getMetadata();
      const tweets = await storage.getAllTweets();
      
      res.json({
        success: true,
        totalTweets: tweets.length,
        lastUpdated: metadata?.uploadedAt || null,
      });
    } catch (error) {
      console.error('Error refreshing data:', error);
      res.status(500).json({ error: 'Failed to refresh data' });
    }
  });

  // Get metadata
  app.get('/api/metadata', async (req, res) => {
    try {
      const metadata = await storage.getMetadata();
      if (!metadata) {
        return res.json(null);
      }
      res.json(metadata);
    } catch (error) {
      console.error('Error fetching metadata:', error);
      res.status(500).json({ error: 'Failed to fetch metadata' });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
