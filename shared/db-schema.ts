import { pgTable, serial, text, timestamp, real, varchar } from "drizzle-orm/pg-core";

export const tweets = pgTable("tweets", {
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

export const metadata = pgTable("metadata", {
  id: serial("id").primaryKey(),
  filename: text("filename").notNull(),
  uploadedAt: timestamp("uploaded_at").notNull(),
  totalTweets: serial("total_tweets").notNull(),
  updatedAt: timestamp("updated_at").defaultNow(),
});
