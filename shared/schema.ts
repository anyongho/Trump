import { z } from "zod";
import { pgTable, serial, text, timestamp, real, varchar } from "drizzle-orm/pg-core";

export const tweetsTable = pgTable("tweets", {
  id: serial("id").primaryKey(),
  tweetId: varchar("tweet_id", { length: 255 }).notNull().unique(),
  timestr: text("timestr").notNull(),
  time: text("time"),
  content: text("content").notNull(),
  url: text("url").notNull(),
  platform: text("platform"),
  originaltweet: text("originaltweet"),
  impactonmarket: text("impactonmarket"),
  sentimentscore: real("sentimentscore"),
  marketimpactscore: real("marketimpactscore"),
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

// Tweet data schema based on merged_all_excel.xlsx columns
export const tweetSchema = z.object({
  id: z.string(),
  timestr: z.string(), // Date/time string
  time: z.string().optional(), // Alternative time format
  content: z.string(), // Full tweet text
  url: z.string(), // Link to original tweet
  platform: z.string().optional(), // Tweet source platform (e.g., Truth Social)
  originaltweet: z.string().optional(), // Indicator if original or retweet
  impactonmarket: z.string().optional(), // Market impact category (Direct, Indirect, None)
  impact_on_market: z.string().optional(), // Normalized market impact alias
  sentimentscore: z.number().optional(), // Sentiment score (range approx. -1 to +1)
  marketimpactscore: z.number().optional(), // Score measuring estimated market impact
  keywords: z.string().optional(), // Associated keywords, comma separated
  sector: z.string().optional(), // Related market sectors, comma separated
  reason: z.string().optional(), // Brief explanation of market impact
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
