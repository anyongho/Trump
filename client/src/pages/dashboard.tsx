import { useState, useMemo } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
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

  // Refresh mutation
  const refreshMutation = useMutation({
    mutationFn: async () => {
      return apiRequest('POST', '/api/refresh', {});
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/tweets'] });
      queryClient.invalidateQueries({ queryKey: ['/api/metadata'] });
      toast({
        title: "새로고침 완료",
        description: "데이터가 업데이트되었습니다.",
      });
    },
  });

  const handleRefresh = () => {
    refreshMutation.mutate();
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

  const displayTweets = Object.keys(appliedFilters).length > 0 ? filteredTweets : tweets;

  // Extract unique sectors and keywords for filters
  const { availableSectors, availableKeywords } = useMemo(() => {
    const extractQuotedItems = (fieldValue: string | undefined | null): string[] => {
      if (!fieldValue) {
        return [];
      }
      const matches = fieldValue.match(/'([^']*)'/g);
      if (!matches) {
        return [];
      }
      return matches.map(item => item.substring(1, item.length - 1));
    };

    const sectorsSet = new Set<string>();
    const keywordsSet = new Set<string>();

    let dateFilteredTweets = [...tweets];
    if (filters.dateFrom) {
      const fromDate = new Date(filters.dateFrom);
      dateFilteredTweets = dateFilteredTweets.filter(tweet => {
        const tweetDate = new Date(tweet.timestr);
        return tweetDate >= fromDate;
      });
    }

    if (filters.dateTo) {
      const toDate = new Date(filters.dateTo);
      toDate.setHours(23, 59, 59, 999); // End of day
      dateFilteredTweets = dateFilteredTweets.filter(tweet => {
        const tweetDate = new Date(tweet.timestr);
        return tweetDate <= toDate;
      });
    }

    dateFilteredTweets.forEach(tweet => {
      if (tweet.sector) {
        extractQuotedItems(tweet.sector).forEach(s => {
          if (s) sectorsSet.add(s);
        });
      }
      if (tweet.keywords) {
        extractQuotedItems(tweet.keywords).forEach(k => {
          if (k) keywordsSet.add(k);
        });
      }
    });

    return {
      availableSectors: Array.from(sectorsSet).sort(),
      availableKeywords: Array.from(keywordsSet).sort(),
    };
  }, [tweets, filters]);
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
      if (tweet.sentimentscore !== undefined) {
        const range = ranges.find(r => tweet.sentimentscore! >= r.min && tweet.sentimentscore! <= r.max);
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
      const date = tweet.timestr.split(' ')[0] || tweet.timestr.split('T')[0];
      if (!timeSeriesMap.has(date)) {
        timeSeriesMap.set(date, { sentiment: [], marketImpact: [] });
      }
      if (tweet.sentimentscore !== undefined) {
        timeSeriesMap.get(date)!.sentiment.push(tweet.sentimentscore);
      }
      if (tweet.marketimpactscore !== undefined) {
        timeSeriesMap.get(date)!.marketImpact.push(tweet.marketimpactscore);
      }
    });

    const timeSeriesData: TimeSeriesData[] = Array.from(timeSeriesMap.entries())
      .map(([date, data]) => ({
        date,
        sentiment: data.sentiment.length > 0 ? data.sentiment.reduce((a, b) => a + b, 0) / data.sentiment.length : 0,
        marketImpact: data.marketImpact.length > 0 ? data.marketImpact.reduce((a, b) => a + b, 0) / data.marketImpact.length : 0,
      }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .slice(-30);

    // Impact category
    const impactMap = new Map<string, number>();
    displayTweets.forEach(tweet => {
      const impact = tweet.impactonmarket || 'None';
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
        tweet.sector.split(',').forEach(s => {
          const trimmed = s.trim();
          if (trimmed) {
            sectorMap.set(trimmed, (sectorMap.get(trimmed) || 0) + 1);
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
        tweet.keywords.split(',').forEach(k => {
          const trimmed = k.trim();
          if (trimmed) {
            keywordMap.set(trimmed, (keywordMap.get(trimmed) || 0) + 1);
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
        isRefreshing={refreshMutation.isPending}
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
                      .filter(t => t.sentimentscore !== undefined)
                      .reduce((sum, t) => sum + (t.sentimentscore || 0), 0) /
                      displayTweets.filter(t => t.sentimentscore !== undefined).length
                    ).toFixed(2)
                    : '0.00'}
                </p>
              </div>
              <div className="p-6 bg-card rounded-xl border border-border shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-medium text-muted-foreground">직접 영향 트윗</h3>
                  <Zap className="h-4 w-4 text-yellow-500" />
                </div>
                <p className="text-3xl font-bold text-foreground font-mono" data-testid="stat-direct-impact">
                  {displayTweets.filter(t => t.impactonmarket === 'Direct').length.toLocaleString()}
                </p>
              </div>
            </div>

            {/* Data Table */}
            <div>
              <h2 className="text-2xl font-semibold text-foreground mb-4">트윗 목록</h2>
              <TweetsTable
                tweets={displayTweets}
                onTweetClick={(tweet) => console.log('Tweet clicked:', tweet)}
              />
            </div>

            {/* Export Controls */}
            <ExportControls tweets={displayTweets} totalCount={tweets.length} />

            {/* Time Series Chart - Full Width */}
            <TimeSeriesChart data={chartData.timeSeriesData} />

            {/* Sentiment Distribution - Full Width */}
            <SentimentDistributionChart data={chartData.sentimentDistribution} />

            {/* Impact & Sector Charts - Half Width Each */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <ImpactCategoryChart data={chartData.impactCategoryData} />
              <SectorChart data={chartData.sectorData} />
            </div>

            {/* Keyword Chart - Full Width */}
            <KeywordChart data={chartData.keywordData} />
          </div>
        </main>
      </div>
    </div>
  );
}
