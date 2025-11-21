import { Tweet, TweetFilter, UploadMetadata } from "@shared/schema";
import { randomUUID } from "crypto";

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

export const storage = new MemStorage();
