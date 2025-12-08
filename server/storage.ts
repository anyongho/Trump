import { Tweet, TweetFilter, UploadMetadata, Analyze, Report } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // Tweet operations
  getAllTweets(): Promise<Tweet[]>;
  getTweetById(id: number): Promise<Tweet | null>;
  setTweets(tweets: Tweet[]): Promise<void>;
  filterTweets(filter: TweetFilter): Promise<Tweet[]>;

  // Metadata operations
  getMetadata(): Promise<UploadMetadata | null>;
  setMetadata(metadata: UploadMetadata): Promise<void>;

  // Analysis and Report operations
  getLatestAnalysis(): Promise<Analyze | null>;
  getLatestReport(): Promise<Report | null>;
}

export class SupabaseStorage implements IStorage {
  async getAllTweets(): Promise<Tweet[]> {
    const { supabase } = await import('./supabase');
    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .order('created_at', { ascending: false })
      .range(0, 9999); // Get up to 10000 rows instead of default 1000

    if (error) {
      console.error('Error fetching tweets from Supabase:', error);
      throw new Error('Failed to fetch tweets from Supabase');
    }

    console.log(`[Supabase] Loaded ${data?.length || 0} tweets from database`);
    if (data && data.length > 0) {
      console.log('[Supabase] Sample tweet:', data[0]);
    }

    return (data || []).map((post: any) => ({
      id: post.id,
      url: post.url,
      content: post.content || '',
      time_str: post.time_str,
      time: post.time,
      impact_on_market: post.impact_on_market,
      sentiment_score: post.sentiment_score,
      market_impact_score: post.market_impact_score,
      keywords: post.keywords,
      sector: post.sector,
      reason: post.reason,
      created_at: post.created_at,
      platform: post.platform,
    }));
  }

  async getTweetById(id: number): Promise<Tweet | null> {
    const { supabase } = await import('./supabase');
    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error(`Error fetching tweet ID ${id} from Supabase:`, error);
      return null;
    }

    if (!data) {
      return null;
    }

    return {
      id: data.id,
      url: data.url,
      content: data.content || '',
      time_str: data.time_str,
      time: data.time,
      impact_on_market: data.impact_on_market,
      sentiment_score: data.sentiment_score,
      market_impact_score: data.market_impact_score,
      keywords: data.keywords,
      sector: data.sector,
      reason: data.reason,
      created_at: data.created_at,
      platform: data.platform,
    };
  }

  async setTweets(tweets: Tweet[]): Promise<void> {
    // Not needed for Supabase - data is managed in the database
    console.warn('setTweets is not implemented for SupabaseStorage');
  }

  async filterTweets(filter: TweetFilter): Promise<Tweet[]> {
    const { supabase } = await import('./supabase');
    let query = supabase.from('posts').select('*');

    console.log('[Filter] Applied filters:', filter);
    console.log('[Filter] Date range:', {
      dateFrom: filter.dateFrom,
      dateTo: filter.dateTo,
      dateToWithTime: filter.dateTo ? new Date(filter.dateTo).toISOString() : 'none'
    });

    // Filter by date range (using 'time' field which is in ISO format)
    if (filter.dateFrom) {
      query = query.gte('time', filter.dateFrom);
      console.log('[Filter] Date from:', filter.dateFrom);
    }

    if (filter.dateTo) {
      const toDate = new Date(filter.dateTo);
      toDate.setHours(23, 59, 59, 999);
      const toDateISO = toDate.toISOString();
      query = query.lte('time', toDateISO);
      console.log('[Filter] Date to (original):', filter.dateTo);
      console.log('[Filter] Date to (with time):', toDateISO);
    }

    // Filter by sentiment score range
    if (filter.sentimentMin !== undefined) {
      query = query.gte('sentiment_score', filter.sentimentMin);
    }

    if (filter.sentimentMax !== undefined) {
      query = query.lte('sentiment_score', filter.sentimentMax);
    }

    // Filter by impact category
    if (filter.impactCategory && filter.impactCategory.length > 0) {
      query = query.in('impact_on_market', filter.impactCategory);
    }

    const { data, error } = await query
      .order('created_at', { ascending: false })
      .range(0, 9999); // Get up to 10000 rows instead of default 1000

    if (error) {
      console.error('Error filtering tweets from Supabase:', error);
      throw new Error('Failed to filter tweets from Supabase');
    }

    console.log(`[Filter] Supabase returned ${data?.length || 0} tweets`);
    if (data && data.length > 0) {
      console.log('[Filter] Sample filtered tweet:', data[0]);
    }

    let filtered = (data || []).map((post: any) => ({
      id: post.id,
      url: post.url,
      content: post.content || '',
      time_str: post.time_str,
      time: post.time,
      impact_on_market: post.impact_on_market,
      sentiment_score: post.sentiment_score,
      market_impact_score: post.market_impact_score,
      keywords: post.keywords,
      sector: post.sector,
      reason: post.reason,
      created_at: post.created_at,
      platform: post.platform,
    }));

    const extractQuotedItems = (fieldValue: string | undefined | null): string[] => {
      if (!fieldValue) {
        return [];
      }
      // Check if it looks like the old format ['a', 'b'] or 'a', 'b'
      if (fieldValue.includes("','") || fieldValue.startsWith("['")) {
        const matches = fieldValue.match(/'([^']*)'/g);
        if (matches && matches.length > 0) {
          return matches.map(item => item.substring(1, item.length - 1));
        }
      }
      // Fallback: split by comma for non-quoted items (e.g., "item1, item2")
      return fieldValue.split(',').map(s => s.trim()).filter(Boolean);
    };

    // Client-side filters for sectors and keywords (Supabase doesn't support array contains easily)
    if (filter.sectors && filter.sectors.length > 0) {
      filtered = filtered.filter((tweet: Tweet) => {
        if (!tweet.sector) return false;
        const tweetSectors = extractQuotedItems(tweet.sector);
        return filter.sectors!.some((filterSector: any) =>
          tweetSectors.includes(filterSector)
        );
      });
    }

    if (filter.keywords && filter.keywords.length > 0) {
      filtered = filtered.filter((tweet: Tweet) => {
        if (!tweet.keywords) return false;
        const tweetKeywords = extractQuotedItems(tweet.keywords);
        return filter.keywords!.some((filterKeyword: any) =>
          tweetKeywords.some(tk => tk.trim().toLowerCase() === filterKeyword.trim().toLowerCase())
        );
      });
    }

    // Filter by search text
    if (filter.searchText && filter.searchText.trim()) {
      const searchLower = filter.searchText.toLowerCase();
      filtered = filtered.filter((tweet: Tweet) =>
        tweet.content && tweet.content.toLowerCase().includes(searchLower)
      );
    }

    return filtered;
  }

  async getMetadata(): Promise<UploadMetadata | null> {
    const { supabase } = await import('./supabase');
    const { count, error } = await supabase.from('posts').select('*', { count: 'exact', head: true });

    if (error) {
      console.error('Error fetching metadata from Supabase:', error);
      return null;
    }

    return {
      filename: 'Supabase Database',
      uploadedAt: new Date().toISOString(),
      totalTweets: count || 0,
    };
  }

  async setMetadata(metadata: UploadMetadata): Promise<void> {
    // Not needed for Supabase
    console.warn('setMetadata is not implemented for SupabaseStorage');
  }

  async getLatestAnalysis(): Promise<Analyze | null> {
    const { supabase } = await import('./supabase');
    const { data, error } = await supabase
      .from('analyze')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (error) {
      console.error('Error fetching latest analysis from Supabase:', error);
      return null;
    }

    if (!data) {
      return null;
    }

    return {
      id: data.id,
      title: data.title,
      time: data.time,
      forecast: data.forecast,
      posts: data.posts,
      model: data.model,
      stock: data.stock,
      created_at: data.created_at,
    };
  }

  async getLatestReport(): Promise<Report | null> {
    const { supabase } = await import('./supabase');
    const { data, error } = await supabase
      .from('report')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (error) {
      console.error('Error fetching latest report from Supabase:', error);
      return null;
    }

    if (!data) {
      return null;
    }

    return {
      id: data.id,
      report: data.report,
      stock: data.stock,
      created_at: data.created_at,
    };
  }
}

export const storage = new SupabaseStorage();
