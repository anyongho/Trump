import { z } from "zod";
import { pgTable, serial, text, timestamp, real, varchar } from "drizzle-orm/pg-core";

export const tweetsTable = pgTable("posts", {
  id: serial("id").primaryKey(),
  url: text("url").notNull().unique(),
  content: text("content"),
  time_str: text("time_str"),
  time: text("time"),
  impact_on_market: text("impact_on_market"),
  sentiment_score: real("sentiment_score"),
  market_impact_score: real("market_impact_score"),
  keywords: text("keywords"),
  sector: text("sector"),
  reason: text("reason"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const metadataTable = pgTable("metadata", {
  id: serial("id").primaryKey(),
  filename: text("filename").notNull(),
  uploadedAt: timestamp("uploaded_at").notNull(),
  totalTweets: serial("total_tweets").notNull(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Tweet data schema based on Supabase posts table
export const tweetSchema = z.object({
  id: z.number(), // Changed from string to number (BIGINT)
  time_str: z.string().optional(), // Rename timestr -> time_str
  time: z.string().optional(),
  content: z.string().optional(),
  url: z.string(),
  impact_on_market: z.string().optional(), // Rename impactonmarket -> impact_on_market
  sentiment_score: z.number().optional(), // Rename sentimentscore -> sentiment_score
  market_impact_score: z.number().optional(), // Rename marketimpactscore -> market_impact_score
  keywords: z.string().optional(),
  sector: z.string().optional(),
  reason: z.string().optional(),
  created_at: z.string().optional(), // Added created_at
  platform: z.string().optional(),
});

export type Tweet = z.infer<typeof tweetSchema>;

// Filter schema
export const filterSchema = z.object({
  dateFrom: z.string().optional(),
  dateTo: z.string().optional(),
  sentimentMin: z.number().optional(),
  sentimentMax: z.number().optional(),
  impactCategory: z.array(z.string()).optional(),
  sectors: z.array(z.string()).optional(),
  keywords: z.array(z.string()).optional(),
  searchText: z.string().optional(),
});

export type TweetFilter = z.infer<typeof filterSchema>;

// Upload metadata
export const uploadMetadataSchema = z.object({
  filename: z.string(),
  uploadedAt: z.string(),
  totalTweets: z.number(),
});

export type UploadMetadata = z.infer<typeof uploadMetadataSchema>;

// Chart data types
export interface SentimentDistribution {
  range: string;
  count: number;
}

export interface TimeSeriesData {
  date: string;
  sentiment: number;
  marketImpact: number;
}

export interface ImpactCategoryData {
  category: string;
  count: number;
}

export interface SectorData {
  sector: string;
  count: number;
}

export interface KeywordData {
  keyword: string;
  count: number;
}
