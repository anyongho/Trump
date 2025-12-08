import { useState, useMemo, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { Tweet, TweetFilter, UploadMetadata, SentimentDistribution, TimeSeriesData, ImpactCategoryData, SectorData, KeywordData } from "@shared/schema";
import { DashboardHeader } from "@/components/dashboard-header";
import { FilterSidebar } from "@/components/filter-sidebar";
import { TweetsTable } from "@/components/tweets-table";
import { SentimentDistributionChart } from "@/components/charts/sentiment-distribution-chart";
import { TimeSeriesChart } from "@/components/charts/time-series-chart";
import { ImpactCategoryChart } from "@/components/charts/impact-category-chart";
import { SectorChart } from "@/components/charts/sector-chart";
import { KeywordChart } from "@/components/charts/keyword-chart";
import { ExportControls } from "@/components/export-controls";
import { EmptyState } from "@/components/empty-state";
import { LoadingState } from "@/components/loading-state";
import { useToast } from "@/hooks/use-toast";
import { MessageSquare, TrendingUp, Zap } from "lucide-react";

import { subDays, format } from "date-fns";

const PREDEFINED_SECTORS = [
  'Financials',
  'Information Technology',
  'Health Care',
  'Consumer Discretionary',
  'Communication Services',
  'Industrials',
  'Consumer Staples',
  'Energy',
  'Real Estate',
  'Materials',
  'Utilities'
];

export default function Dashboard() {
  const { toast } = useToast();
  const [location] = useLocation();

  // Get ID from URL query parameters
  const urlParams = new URLSearchParams(window.location.search);
  const targetId = urlParams.get('id') ? parseInt(urlParams.get('id')!) : null;

  // 오늘 기준 30일 전 날짜 계산
  const today = new Date();
  const thirtyDaysAgo = subDays(today, 30);
  const initialDateFrom = format(thirtyDaysAgo, "yyyy-MM-dd");
  const initialDateTo = format(today, "yyyy-MM-dd");

  const [filters, setFilters] = useState<TweetFilter>({
    dateFrom: initialDateFrom,
    dateTo: initialDateTo,
  });
  const [appliedFilters, setAppliedFilters] = useState<TweetFilter>({
    dateFrom: initialDateFrom,
    dateTo: initialDateTo,
  });

  // Fetch metadata
  const { data: metadata } = useQuery<UploadMetadata>({
    queryKey: ['/api/metadata'],
  });

  // Fetch all tweets
  const { data: tweets = [], isLoading } = useQuery<Tweet[]>({
    queryKey: ['/api/tweets'],
  });

  // Fetch filtered tweets
  const { data: filteredTweets = [] } = useQuery<Tweet[]>({
    queryKey: ['/api/tweets/filter', appliedFilters],
    queryFn: async () => {
      if (Object.keys(appliedFilters).length === 0) return [];

      const params = new URLSearchParams();
      if (appliedFilters.dateFrom) params.append('dateFrom', appliedFilters.dateFrom);
      if (appliedFilters.dateTo) params.append('dateTo', appliedFilters.dateTo);
      if (appliedFilters.sentimentMin !== undefined) params.append('sentimentMin', appliedFilters.sentimentMin.toString());
      if (appliedFilters.sentimentMax !== undefined) params.append('sentimentMax', appliedFilters.sentimentMax.toString());
      if (appliedFilters.impactCategory) {
        appliedFilters.impactCategory.forEach(cat => params.append('impactCategory', cat));
      }
      if (appliedFilters.sectors) {
        appliedFilters.sectors.forEach(sector => params.append('sectors', sector));
      }
      if (appliedFilters.keywords) {
        appliedFilters.keywords.forEach(keyword => params.append('keywords', keyword));
      }
      if (appliedFilters.searchText) params.append('searchText', appliedFilters.searchText);

      const res = await fetch(`/api/tweets/filter?${params.toString()}`, {
        credentials: 'include',
      });

      if (!res.ok) {
        throw new Error('Failed to fetch filtered tweets');
      }

      return res.json();
    },
    enabled: Object.keys(appliedFilters).length > 0,
  });

  // Refresh handler - simply invalidate queries to refetch from Supabase
  const handleRefresh = () => {
    queryClient.invalidateQueries({ queryKey: ['/api/tweets'] });
    queryClient.invalidateQueries({ queryKey: ['/api/tweets/filter'] });
    queryClient.invalidateQueries({ queryKey: ['/api/metadata'] });
    toast({
      title: "새로고침 완료",
      description: "데이터가 업데이트되었습니다.",
    });
  };

  const handleApplyFilters = () => {
    setAppliedFilters(filters);
  };

  const handleResetFilters = () => {
    setFilters({
      dateFrom: initialDateFrom,
      dateTo: initialDateTo,
    });
    setAppliedFilters({
      dateFrom: initialDateFrom,
      dateTo: initialDateTo,
    });
  };

  // Auto-scroll to target tweet if ID is provided
  useEffect(() => {
    if (targetId && tweets.length > 0) {
      const targetTweet = tweets.find(t => t.id === targetId);
      if (targetTweet) {
        // Show a toast notification
        toast({
          title: "분석 트윗 찾기",
          description: `ID ${targetId}번 트윗으로 이동했습니다.`,
        });

        // Highlight the tweet by expanding it
        setTimeout(() => {
          const element = document.getElementById(`tweet-${targetId}`);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'center' });
            element.classList.add('ring-2', 'ring-blue-500', 'ring-offset-2');
          }
        }, 500);
      }
    }
  }, [targetId, tweets, toast]);

  const displayTweets = Object.keys(appliedFilters).length > 0 ? filteredTweets : tweets;

  // Filter tweets based on current sidebar date inputs for option generation
  const sidebarTweets = useMemo(() => {
    if (!filters.dateFrom && !filters.dateTo) return tweets;

    const from = filters.dateFrom ? new Date(filters.dateFrom) : null;
    const to = filters.dateTo ? new Date(filters.dateTo) : null;

    // Set end of day for 'to' date to include all tweets on that day
    if (to) {
      to.setHours(23, 59, 59, 999);
    }

    return tweets.filter(tweet => {
      if (!tweet.time) return false;
      const tweetDate = new Date(tweet.time);
      if (from && tweetDate < from) return false;
      if (to && tweetDate > to) return false;
      return true;
    });
  }, [tweets, filters.dateFrom, filters.dateTo]);

  // Extract unique sectors and keywords for filters
  const { availableSectors, availableKeywords } = useMemo(() => {
    const extractQuotedItems = (fieldValue: string | undefined | null): string[] => {
      if (!fieldValue) {
        return [];
      }

      // Check if it looks like the old format ['a', 'b'] or 'a', 'b'
      // Only use regex if it explicitly contains quoted comma pattern or starts/ends with brackets/quotes
      if (fieldValue.includes("','") || fieldValue.startsWith("['")) {
        const matches = fieldValue.match(/'([^']*)'/g);
        if (matches && matches.length > 0) {
          return matches.map(item => item.substring(1, item.length - 1));
        }
      }

      // Fallback for non-quoted, comma-separated values (Supabase default)
      // This safely handles apostrophes like "America's"
      return fieldValue.split(',').map(s => s.trim()).filter(Boolean);
    };

    const sectorsSet = new Set<string>();
    const keywordsSet = new Set<string>();

    console.log('[Dashboard] Extracting from sidebarTweets:', sidebarTweets.length);

    sidebarTweets.forEach(tweet => {
      if (tweet.sector) {
        extractQuotedItems(tweet.sector).forEach(s => {
          if (s) sectorsSet.add(s);
        });
      }
      if (tweet.keywords) {
        const extracted = extractQuotedItems(tweet.keywords);
        extracted.forEach(k => {
          if (k) keywordsSet.add(k.toLowerCase());
        });
      }
    });

    console.log('[Dashboard] Total keywords extracted:', keywordsSet.size);
    console.log('[Dashboard] Sample keywords:', Array.from(keywordsSet).slice(0, 10));
    console.log('[Dashboard] Total sectors extracted:', sectorsSet.size);

    return {
      availableSectors: Array.from(sectorsSet).sort(),
      availableKeywords: Array.from(keywordsSet).sort(),
    };
  }, [sidebarTweets]);
  // Calculate chart data
  const chartData = useMemo(() => {
    // Sentiment distribution
    const sentimentBuckets = new Map<string, number>();
    const ranges = [
      { min: -1, max: -0.6, label: '-1.0 ~ -0.6' },
      { min: -0.6, max: -0.2, label: '-0.6 ~ -0.2' },
      { min: -0.2, max: 0.2, label: '-0.2 ~ 0.2' },
      { min: 0.2, max: 0.6, label: '0.2 ~ 0.6' },
      { min: 0.6, max: 1, label: '0.6 ~ 1.0' },
    ];

    ranges.forEach(range => sentimentBuckets.set(range.label, 0));

    displayTweets.forEach(tweet => {
      if (tweet.sentiment_score !== undefined) {
        const range = ranges.find(r => tweet.sentiment_score! >= r.min && tweet.sentiment_score! <= r.max);
        if (range) {
          sentimentBuckets.set(range.label, (sentimentBuckets.get(range.label) || 0) + 1);
        }
      }
    });

    const sentimentDistribution: SentimentDistribution[] = Array.from(sentimentBuckets.entries()).map(([range, count]) => ({
      range,
      count,
    }));

    // Time series
    const timeSeriesMap = new Map<string, { sentiment: number[], marketImpact: number[] }>();
    displayTweets.forEach(tweet => {
      const date = (tweet.time || '').split(' ')[0] || (tweet.time || '').split('T')[0];
      if (!timeSeriesMap.has(date)) {
        timeSeriesMap.set(date, { sentiment: [], marketImpact: [] });
      }
      if (tweet.sentiment_score !== undefined) {
        timeSeriesMap.get(date)!.sentiment.push(tweet.sentiment_score);
      }
      if (tweet.market_impact_score !== undefined) {
        timeSeriesMap.get(date)!.marketImpact.push(tweet.market_impact_score);
      }
    });

    const timeSeriesData: TimeSeriesData[] = Array.from(timeSeriesMap.entries())
      .map(([date, data]) => ({
        date,
        sentiment: data.sentiment.length > 0 ? data.sentiment.reduce((a, b) => a + b, 0) / data.sentiment.length : 0,
        marketImpact: data.marketImpact.length > 0 ? data.marketImpact.reduce((a, b) => a + b, 0) / data.marketImpact.length : 0,
      }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    // Impact category
    const impactMap = new Map<string, number>();
    displayTweets.forEach(tweet => {
      const impact = tweet.impact_on_market || 'No';
      impactMap.set(impact, (impactMap.get(impact) || 0) + 1);
    });

    const impactCategoryData: ImpactCategoryData[] = Array.from(impactMap.entries()).map(([category, count]) => ({
      category,
      count,
    }));

    // Sector data
    const sectorMap = new Map<string, number>();
    displayTweets.forEach(tweet => {
      if (tweet.sector) {
        // Robust parsing for sectors
        let sectors: string[] = [];
        if (tweet.sector.includes("','") || tweet.sector.startsWith("['")) {
          const matches = tweet.sector.match(/'([^']*)'/g);
          if (matches && matches.length > 0) {
            sectors = matches.map(item => item.substring(1, item.length - 1));
          }
        }

        if (sectors.length === 0) {
          sectors = tweet.sector.split(',').map(s => s.trim()).filter(Boolean);
        }

        sectors.forEach(s => {
          if (s) {
            sectorMap.set(s, (sectorMap.get(s) || 0) + 1);
          }
        });
      }
    });

    const sectorData: SectorData[] = Array.from(sectorMap.entries())
      .map(([sector, count]) => ({ sector, count }))
      // .filter(item => PREDEFINED_SECTORS.map(s => s.toLowerCase()).includes(item.sector.toLowerCase())) // Temporarily commented out for debugging
      .sort((a, b) => b.count - a.count);

    // Keyword data
    const keywordMap = new Map<string, number>();
    displayTweets.forEach(tweet => {
      if (tweet.keywords) {
        // Robust parsing for keywords
        let keywords: string[] = [];
        if (tweet.keywords.includes("','") || tweet.keywords.startsWith("['")) {
          const matches = tweet.keywords.match(/'([^']*)'/g);
          if (matches && matches.length > 0) {
            keywords = matches.map(item => item.substring(1, item.length - 1));
          }
        }

        if (keywords.length === 0) {
          keywords = tweet.keywords.split(',').map(s => s.trim()).filter(Boolean);
        }

        keywords.forEach(k => {
          if (k) {
            const lowerK = k.toLowerCase();
            keywordMap.set(lowerK, (keywordMap.get(lowerK) || 0) + 1);
          }
        });
      }
    });

    const keywordData: KeywordData[] = Array.from(keywordMap.entries())
      .map(([keyword, count]) => ({ keyword, count }))
      .sort((a, b) => b.count - a.count);

    return {
      sentimentDistribution,
      timeSeriesData,
      impactCategoryData,
      sectorData,
      keywordData,
    };
  }, [displayTweets]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <DashboardHeader
          lastUpdated={null}
          onRefresh={handleRefresh}
        />
        <LoadingState />
      </div>
    );
  }

  if (tweets.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <DashboardHeader
          lastUpdated={null}
          onRefresh={handleRefresh}
        />
        <EmptyState />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader
        lastUpdated={metadata?.uploadedAt ? new Date(metadata.uploadedAt) : null}
        onRefresh={handleRefresh}
      />

      <div className="flex">
        <aside className="w-80 flex-shrink-0">
          <FilterSidebar
            filters={filters}
            onFiltersChange={setFilters}
            availableSectors={availableSectors}
            availableKeywords={availableKeywords}
            onApply={handleApplyFilters}
            onReset={handleResetFilters}
          />
        </aside>

        <main className="flex-1 p-8 max-w-9xl mx-auto">
          <div className="space-y-8">
            {/* Statistics Overview */}
            {/* Statistics Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-6 bg-card rounded-xl border border-border shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-medium text-muted-foreground">총 트윗 수</h3>
                  <MessageSquare className="h-4 w-4 text-primary" />
                </div>
                <p className="text-3xl font-bold text-foreground font-mono" data-testid="stat-total-tweets">
                  {displayTweets.length.toLocaleString()}
                </p>
              </div>
              <div className="p-6 bg-card rounded-xl border border-border shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-medium text-muted-foreground">평균 감정 점수</h3>
                  <TrendingUp className="h-4 w-4 text-green-500" />
                </div>
                <p className="text-3xl font-bold text-foreground font-mono" data-testid="stat-avg-sentiment">
                  {displayTweets.length > 0
                    ? (displayTweets
                      .filter(t => t.sentiment_score !== undefined)
                      .reduce((sum, t) => sum + (t.sentiment_score || 0), 0) /
                      displayTweets.filter(t => t.sentiment_score !== undefined).length
                    ).toFixed(2)
                    : '0.00'}
                </p>
              </div>
              <div className="p-6 bg-card rounded-xl border border-border shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-medium text-muted-foreground">기업 언급 트윗</h3>
                  <Zap className="h-4 w-4 text-yellow-500" />
                </div>
                <p className="text-3xl font-bold text-foreground font-mono" data-testid="stat-direct-impact">
                  {displayTweets.filter(t => t.impact_on_market === 'Direct').length.toLocaleString()}
                </p>
              </div>
            </div>

            {/* Data Table */}
            <div>
              <h2 className="text-2xl font-semibold text-foreground mb-4">트윗 목록</h2>
              <TweetsTable
                tweets={displayTweets}
                onTweetClick={(tweet) => console.log('Tweet clicked:', tweet)}
                targetId={targetId}
              />
            </div>

            {/* Export Controls */}
            <ExportControls tweets={displayTweets} totalCount={tweets.length} />

            {/* Time Series Chart - Full Width */}
            <TimeSeriesChart key={`ts-${JSON.stringify(appliedFilters)}`} data={chartData.timeSeriesData} />

            {/* Sentiment Distribution - Full Width */}
            <SentimentDistributionChart key={`sd-${JSON.stringify(appliedFilters)}`} data={chartData.sentimentDistribution} />

            {/* Impact & Sector Charts - Half Width Each */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <ImpactCategoryChart key={`ic-${JSON.stringify(appliedFilters)}`} data={chartData.impactCategoryData} />
              <SectorChart key={`sc-${JSON.stringify(appliedFilters)}`} data={chartData.sectorData} />
            </div>

            {/* Keyword Chart - Full Width */}
            <KeywordChart key={`kw-${JSON.stringify(appliedFilters)}`} data={chartData.keywordData} />
          </div>
        </main>
      </div>
    </div>
  );
}
