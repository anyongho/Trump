import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { filterSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Get all tweets
  app.get('/api/tweets', async (req, res) => {
    try {
      const tweets = await storage.getAllTweets();

      // impact_on_market 필드 보장
      const normalizedTweets = tweets.map(tweet => ({
        ...tweet,
        impact_on_market: tweet.impactonmarket || tweet.impact_on_market || '없음',
      }));

      res.json(normalizedTweets);
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
      
      let tweets = await storage.filterTweets(validatedFilter);

      // impact_on_market 필드 보장
      tweets = tweets.map(tweet => ({
        ...tweet,
        impact_on_market: tweet.impactonmarket || tweet.impact_on_market || '없음',
      }));

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
