import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { stockService } from "./stock-service";
import { filterSchema } from "@shared/schema";
import { z } from "zod";

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

  // Get filtered tweets - MUST come before /api/tweets/:id
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

  // Get single tweet by ID - MUST come after more specific routes
  app.get('/api/tweets/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: 'Invalid tweet ID' });
      }

      const tweet = await storage.getTweetById(id);
      if (!tweet) {
        return res.status(404).json({ error: 'Tweet not found' });
      }

      res.json(tweet);
    } catch (error) {
      console.error('Error fetching tweet by ID:', error);
      res.status(500).json({ error: 'Failed to fetch tweet' });
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

  // Get stock data
  app.get('/api/stocks/:symbol', async (req, res) => {
    try {
      const symbol = req.params.symbol.toUpperCase();
      const interval = (req.query.interval as 'daily' | 'intraday') || 'daily';

      const data = await stockService.getStockData(symbol, interval);

      if (!data) {
        return res.status(503).json({ error: 'Service unavailable or API limit reached' });
      }

      res.json(data);
    } catch (error) {
      console.error('Error fetching stock data:', error);
      res.status(500).json({ error: 'Failed to fetch stock data' });
    }
  });

  // Get latest analysis
  app.get('/api/analysis/latest', async (req, res) => {
    try {
      const analysis = await storage.getLatestAnalysis();
      if (!analysis) {
        return res.json(null);
      }
      res.json(analysis);
    } catch (error) {
      console.error('Error fetching latest analysis:', error);
      res.status(500).json({ error: 'Failed to fetch latest analysis' });
    }
  });

  // Get latest report
  app.get('/api/report/latest', async (req, res) => {
    try {
      const report = await storage.getLatestReport();
      if (!report) {
        return res.json(null);
      }
      res.json(report);
    } catch (error) {
      console.error('Error fetching latest report:', error);
      res.status(500).json({ error: 'Failed to fetch latest report' });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
