import { Tweet, TweetFilter, UploadMetadata, tweetsTable, metadataTable } from "@shared/schema";
import { randomUUID } from "crypto";
import { db } from "./db";
import { eq, and, gte, lte, sql, inArray, desc } from "drizzle-orm";

export interface IStorage {
  // Tweet operations
  getAllTweets(): Promise<Tweet[]>;
  setTweets(tweets: Tweet[]): Promise<void>;
  filterTweets(filter: TweetFilter): Promise<Tweet[]>;
  
  // Metadata operations
  getMetadata(): Promise<UploadMetadata | null>;
  setMetadata(metadata: UploadMetadata): Promise<void>;
}

export class MemStorage implements IStorage {
  private tweets: Tweet[] = [];
  private metadata: UploadMetadata | null = null;

  async getAllTweets(): Promise<Tweet[]> {
    return [...this.tweets];
  }

  async setTweets(tweets: Tweet[]): Promise<void> {
    this.tweets = tweets;
  }

  async filterTweets(filter: TweetFilter): Promise<Tweet[]> {
    let filtered = [...this.tweets];

    // Filter by date range
    if (filter.dateFrom) {
      const fromDate = new Date(filter.dateFrom);
      filtered = filtered.filter(tweet => {
        const tweetDate = new Date(tweet.timestr);
        return tweetDate >= fromDate;
      });
    }

    if (filter.dateTo) {
      const toDate = new Date(filter.dateTo);
      toDate.setHours(23, 59, 59, 999); // End of day
      filtered = filtered.filter(tweet => {
        const tweetDate = new Date(tweet.timestr);
        return tweetDate <= toDate;
      });
    }

    // Filter by sentiment score range
    if (filter.sentimentMin !== undefined) {
      filtered = filtered.filter(tweet => 
        tweet.sentimentscore !== undefined && tweet.sentimentscore >= filter.sentimentMin!
      );
    }

    if (filter.sentimentMax !== undefined) {
      filtered = filtered.filter(tweet => 
        tweet.sentimentscore !== undefined && tweet.sentimentscore <= filter.sentimentMax!
      );
    }

    // Filter by impact category
    if (filter.impactCategory && filter.impactCategory.length > 0) {
      filtered = filtered.filter(tweet => 
        filter.impactCategory!.includes(tweet.impactonmarket || 'None')
      );
    }

    // Filter by sectors
    if (filter.sectors && filter.sectors.length > 0) {
      filtered = filtered.filter(tweet => {
        if (!tweet.sector) return false;
        const tweetSectors = tweet.sector.split(',').map(s => s.trim());
        return filter.sectors!.some(filterSector => 
          tweetSectors.includes(filterSector)
        );
      });
    }

    // Filter by keywords
    if (filter.keywords && filter.keywords.length > 0) {
      filtered = filtered.filter(tweet => {
        if (!tweet.keywords) return false;
        const tweetKeywords = tweet.keywords.split(',').map(k => k.trim());
        return filter.keywords!.some(filterKeyword => 
          tweetKeywords.includes(filterKeyword)
        );
      });
    }

    // Filter by search text (searches in content)
    if (filter.searchText && filter.searchText.trim()) {
      const searchLower = filter.searchText.toLowerCase();
      filtered = filtered.filter(tweet => 
        tweet.content.toLowerCase().includes(searchLower)
      );
    }

    return filtered;
  }

  async getMetadata(): Promise<UploadMetadata | null> {
    return this.metadata;
  }

  async setMetadata(metadata: UploadMetadata): Promise<void> {
    this.metadata = metadata;
  }
}

export class DbStorage implements IStorage {
  async getAllTweets(): Promise<Tweet[]> {
    const rows = await db.select().from(tweetsTable);
    return rows.map(row => ({
      id: row.tweetId,
      timestr: row.timestr,
      time: row.time || undefined,
      content: row.content,
      url: row.url,
      platform: row.platform || undefined,
      originaltweet: row.originaltweet || undefined,
      impactonmarket: row.impactonmarket || undefined,
      sentimentscore: row.sentimentscore || undefined,
      marketimpactscore: row.marketimpactscore || undefined,
      keywords: row.keywords || undefined,
      sector: row.sector || undefined,
      reason: row.reason || undefined,
    }));
  }

  async setTweets(tweets: Tweet[]): Promise<void> {
    await db.delete(tweetsTable);
    
    if (tweets.length === 0) return;

    await db.insert(tweetsTable).values(
      tweets.map(tweet => ({
        tweetId: tweet.id,
        timestr: tweet.timestr,
        time: tweet.time,
        content: tweet.content,
        url: tweet.url,
        platform: tweet.platform,
        originaltweet: tweet.originaltweet,
        impactonmarket: tweet.impactonmarket,
        sentimentscore: tweet.sentimentscore,
        marketimpactscore: tweet.marketimpactscore,
        keywords: tweet.keywords,
        sector: tweet.sector,
        reason: tweet.reason,
      }))
    );
  }

  async filterTweets(filter: TweetFilter): Promise<Tweet[]> {
    let query = db.select().from(tweetsTable);
    const conditions: any[] = [];

    if (filter.dateFrom) {
      const fromDate = new Date(filter.dateFrom);
      conditions.push(gte(tweetsTable.timestr, fromDate.toISOString()));
    }

    if (filter.dateTo) {
      const toDate = new Date(filter.dateTo);
      toDate.setHours(23, 59, 59, 999);
      conditions.push(lte(tweetsTable.timestr, toDate.toISOString()));
    }

    if (filter.sentimentMin !== undefined) {
      conditions.push(gte(tweetsTable.sentimentscore, filter.sentimentMin));
    }

    if (filter.sentimentMax !== undefined) {
      conditions.push(lte(tweetsTable.sentimentscore, filter.sentimentMax));
    }

    if (filter.impactCategory && filter.impactCategory.length > 0) {
      conditions.push(inArray(tweetsTable.impactonmarket, filter.impactCategory));
    }

    if (conditions.length > 0) {
      query = query.where(and(...conditions)) as any;
    }

    const rows = await query;
    let filtered = rows.map(row => ({
      id: row.tweetId,
      timestr: row.timestr,
      time: row.time || undefined,
      content: row.content,
      url: row.url,
      platform: row.platform || undefined,
      originaltweet: row.originaltweet || undefined,
      impactonmarket: row.impactonmarket || undefined,
      sentimentscore: row.sentimentscore || undefined,
      marketimpactscore: row.marketimpactscore || undefined,
      keywords: row.keywords || undefined,
      sector: row.sector || undefined,
      reason: row.reason || undefined,
    }));

        if (filter.sectors && filter.sectors.length > 0) {
          filtered = filtered.filter(tweet => {
            if (!tweet.sector) return false;
            const tweetSectors = tweet.sector.split(',').map(s => s.trim());
            return filter.sectors!.some(filterSector =>
              tweetSectors.includes(filterSector)
            );
          });
        }
    
            if (filter.keywords && filter.keywords.length > 0) {
              filtered = filtered.filter(tweet => {
                if (!tweet.keywords) return false;
                const tweetKeywords = tweet.keywords.split(',').map(k => k.trim());
                return filter.keywords!.some(filterKeyword =>
                  tweetKeywords.includes(filterKeyword)
                );
              });
            }    if (filter.searchText && filter.searchText.trim()) {
      const searchLower = filter.searchText.toLowerCase();
      filtered = filtered.filter(tweet => 
        tweet.content.toLowerCase().includes(searchLower)
      );
    }

    return filtered;
  }

  async getMetadata(): Promise<UploadMetadata | null> {
    const rows = await db.select().from(metadataTable).orderBy(desc(metadataTable.updatedAt)).limit(1);
    if (rows.length === 0) return null;
    
    const row = rows[0];
    return {
      filename: row.filename,
      uploadedAt: row.uploadedAt.toISOString(),
      totalTweets: row.totalTweets,
    };
  }

  async setMetadata(metadata: UploadMetadata): Promise<void> {
    await db.delete(metadataTable);
    await db.insert(metadataTable).values({
      filename: metadata.filename,
      uploadedAt: new Date(metadata.uploadedAt),
      totalTweets: metadata.totalTweets,
    });
  }
}

export const storage = new DbStorage();
