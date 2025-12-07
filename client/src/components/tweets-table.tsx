import { useState, Fragment, useEffect } from "react";
import { Tweet } from "@shared/schema";
import { ChevronDown, ChevronUp, ArrowUpDown, ExternalLink, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { format, parseISO } from "date-fns";

interface TweetsTableProps {
  tweets: Tweet[];
  onTweetClick: (tweet: Tweet) => void;
}

type SortField = 'time' | 'sentiment_score' | 'market_impact_score' | 'impact_on_market';
type SortDirection = 'asc' | 'desc';

const ITEMS_PER_PAGE = 15;

const formatArrayString = (value: string | undefined): string => {
  if (!value) return '-';

  try {
    const parsed = JSON.parse(value);
    if (Array.isArray(parsed)) {
      return parsed.join(', ');
    }
  } catch {
  }

  return value;
};

export function TweetsTable({ tweets, onTweetClick }: TweetsTableProps) {
  const [expandedRow, setExpandedRow] = useState<number | null>(null);
  const [sortField, setSortField] = useState<SortField>('time');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [currentPage, setCurrentPage] = useState(1);

  const sectorToEtf: Record<string, string> = {
    'Information Technology': 'XLK',
    'Financials': 'XLF',
    'Industrials': 'XLI',
    'Energy': 'XLE',
    'Consumer Discretionary': 'XLY',
    'Consumer Staples': 'XLP',
    'Communication Services': 'XLC',
    'Materials': 'XLB',
    'Health Care': 'XLV',
    'Utilities': 'XLU',
    'Real Estate': 'XLRE',
  };

  const extractQuotedItems = (fieldValue: string | undefined | null): string[] => {
    if (!fieldValue) {
      return [];
    }
    const matches = fieldValue.match(/'([^']*)'/g);
    if (!matches) {
      // Fallback for non-quoted, comma-separated values
      return fieldValue.split(',').map(s => s.trim()).filter(Boolean);
    }
    return matches.map(item => item.substring(1, item.length - 1));
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [tweets.length]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const sortedTweets = [...tweets].sort((a, b) => {
    let aVal: any = a[sortField];
    let bVal: any = b[sortField];

    if (sortField === 'time') {
      aVal = new Date(aVal).getTime();
      bVal = new Date(bVal).getTime();
    }

    if (aVal === undefined || aVal === null) return 1;
    if (bVal === undefined || bVal === null) return -1;

    if (sortDirection === 'asc') {
      return aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
    } else {
      return aVal > bVal ? -1 : aVal < bVal ? 1 : 0;
    }
  });

  const totalPages = Math.ceil(sortedTweets.length / ITEMS_PER_PAGE);
  const clampedPage = Math.max(1, Math.min(currentPage, totalPages || 1));
  const startIndex = (clampedPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedTweets = sortedTweets.slice(startIndex, endIndex);

  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    setExpandedRow(null);
  };

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 7;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 4) {
        for (let i = 1; i <= 5; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 3) {
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 4; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        pages.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      }
    }

    return pages;
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '-';
    try {
      // Handle Supabase timestamp format (e.g., 2025-01-31 08:09:00)
      // If it's already in a displayable format, parseISO might fail or return invalid date
      const date = new Date(dateStr);
      if (isNaN(date.getTime())) {
        return dateStr;
      }
      return format(date, 'yyyy-MM-dd HH:mm');
    } catch {
      return dateStr;
    }
  };

  const getSentimentColor = (score?: number) => {
    if (score === undefined || score === null) return 'text-muted-foreground';
    if (score > 0.3) return 'text-green-600';
    if (score < -0.3) return 'text-red-600';
    return 'text-yellow-600';
  };

  const getImpactBadgeVariant = (impact?: string) => {
    if (impact === 'Direct') return 'default';
    if (impact === 'Indirect') return 'secondary';
    return 'outline';
  };

  const renderSectors = (sectorString: string | undefined | null) => {
    if (!sectorString) return <span className="text-muted-foreground">N/A</span>;

    const sectors = extractQuotedItems(sectorString);

    return sectors.map((sector, index) => {
      const ticker = sectorToEtf[sector.trim()];
      return (
        <Fragment key={index}>
          {ticker ? (
            <a
              href={`https://finance.yahoo.com/quote/${ticker}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
              onClick={(e) => e.stopPropagation()}
            >
              {sector}
            </a>
          ) : (
            <span>{sector}</span>
          )}
          {index < sectors.length - 1 ? ', ' : ''}
        </Fragment>
      );
    });
  };

  const getRowStyle = (tweet: Tweet) => {
    if (tweet.market_impact_score !== undefined && tweet.market_impact_score > 0.5 && tweet.sentiment_score !== undefined) {
      // Calculate opacity based on absolute sentiment score (0.5 to 1.0 -> 0.1 to 0.3 opacity)
      const opacity = Math.min(0.3, Math.max(0.1, (Math.abs(tweet.sentiment_score) - 0.5) * 0.4 + 0.1));

      if (tweet.sentiment_score > 0.5) {
        // Green for positive
        return { backgroundColor: `rgba(34, 197, 94, ${opacity})` }; // green-500
      } else if (tweet.sentiment_score < -0.5) {
        // Red for negative
        return { backgroundColor: `rgba(239, 68, 68, ${opacity})` }; // red-500
      }
    }
    return {};
  };

  const getRowClassName = (tweet: Tweet) => {
    return "border-b hover-elevate cursor-pointer transition-colors";
  };

  return (
    <div className="rounded-lg border bg-card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[1200px]">
          <thead className="bg-muted/50 sticky top-0 z-10">
            <tr className="border-b">
              <th className="text-left text-sm font-medium text-muted-foreground px-4 py-3">
                <button onClick={() => handleSort('time')} className="flex items-center gap-1 hover:text-foreground transition-colors">
                  날짜/시간(ET)
                  <ArrowUpDown className="h-3 w-3" />
                </button>
              </th>
              <th className="text-left text-sm font-medium text-muted-foreground px-4 py-3">
                트윗 내용
              </th>
              <th className="text-left text-sm font-medium text-muted-foreground px-4 py-3">

              </th>
              <th className="text-left text-sm font-medium text-muted-foreground px-4 py-3">
                <button onClick={() => handleSort('impact_on_market')} className="flex items-center gap-1 hover:text-foreground transition-colors">
                  영향 타입
                  <ArrowUpDown className="h-3 w-3" />
                </button>
              </th>
              <th className="text-left text-sm font-medium text-muted-foreground px-4 py-3">
                <button onClick={() => handleSort('market_impact_score')} className="flex items-center gap-1 hover:text-foreground transition-colors">
                  시장영향도
                  <ArrowUpDown className="h-3 w-3" />
                </button>
              </th>
              <th className="text-left text-sm font-medium text-muted-foreground px-4 py-3">
                <button onClick={() => handleSort('sentiment_score')} className="flex items-center gap-1 hover:text-foreground transition-colors">
                  감정점수
                  <ArrowUpDown className="h-3 w-3" />
                </button>
              </th>
              <th className="text-left text-sm font-medium text-muted-foreground px-4 py-3">
                섹터
              </th>
              <th className="text-center text-sm font-medium text-muted-foreground px-4 py-3 w-16">
                상세
              </th>
            </tr>
          </thead>
          <tbody>
            {paginatedTweets.map((tweet) => (
              <Fragment key={tweet.id}>
                <tr className={getRowClassName(tweet)}
                  style={getRowStyle(tweet)}
                  onClick={() => setExpandedRow(expandedRow === tweet.id ? null : tweet.id)}>
                  <td className="px-4 py-3 text-sm font-mono text-foreground">
                    {formatDate(tweet.time || '')}
                  </td>
                  <td className="px-4 py-3 text-sm text-foreground max-w-md">
                    <div className="line-clamp-2 leading-relaxed">{tweet.content}</div>
                  </td>
                  <td className="px-4 py-3 text-sm">
                    {tweet.url ? (
                      <a href={tweet.url} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} className="text-primary hover:underline">
                        {tweet.platform || '원문'}
                      </a>
                    ) : (
                      <span className="text-muted-foreground">{tweet.platform || '-'}</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant={getImpactBadgeVariant(tweet.impact_on_market)}>
                      {tweet.impact_on_market === 'Direct' ? '기업언급' : tweet.impact_on_market === 'Indirect' ? '시장영향' : '영향없음'}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-sm font-mono text-foreground">
                    {tweet.market_impact_score !== undefined ? tweet.market_impact_score.toFixed(2) : '-'}
                  </td>
                  <td className={`px-4 py-3 text-sm font-mono font-semibold ${getSentimentColor(tweet.sentiment_score)}`}>
                    {tweet.sentiment_score !== undefined ? tweet.sentiment_score.toFixed(2) : '-'}
                  </td>
                  <td className="px-4 py-3 text-sm text-muted-foreground max-w-xs">
                    <div className="line-clamp-1">{renderSectors(tweet.sector)}</div>
                  </td>
                  <td className="px-4 py-3 text-center">
                    {expandedRow === tweet.id ? <ChevronUp className="h-4 w-4 mx-auto text-muted-foreground" /> : <ChevronDown className="h-4 w-4 mx-auto text-muted-foreground" />}
                  </td>
                </tr>

                {expandedRow === tweet.id && (
                  <tr className="bg-muted/30">
                    <td colSpan={8} className="px-4 py-6">
                      <div className="space-y-4 max-w-4xl">
                        <div>
                          <h4 className="text-sm font-semibold text-foreground mb-2">전체 내용</h4>
                          <p className="text-sm text-foreground leading-relaxed">{tweet.content}</p>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <span className="text-xs font-medium text-muted-foreground">키워드</span>
                            <p className="text-sm text-foreground mt-1">{extractQuotedItems(tweet.keywords).join(', ')}</p>
                          </div>
                          <div>
                            <span className="text-xs font-medium text-muted-foreground">섹터</span>
                            <p className="text-sm text-foreground mt-1">{renderSectors(tweet.sector)}</p>
                          </div>
                          <div>
                            <span className="text-xs font-medium text-muted-foreground">감성 점수</span>
                            <p className="text-sm font-mono font-semibold mt-1">{tweet.sentiment_score !== undefined ? tweet.sentiment_score.toFixed(2) : '-'}</p>
                          </div>
                          <div>
                            <span className="text-xs font-medium text-muted-foreground">시장 영향 점수</span>
                            <p className="text-sm font-mono text-foreground mt-1">{tweet.market_impact_score !== undefined ? tweet.market_impact_score.toFixed(2) : '-'}</p>
                          </div>
                          <div>
                            <span className="text-xs font-medium text-muted-foreground">영향 타입</span>
                            <p className="text-sm text-foreground mt-1">
                              {tweet.impact_on_market === 'Direct' ? '기업언급' : tweet.impact_on_market === 'Indirect' ? '시장영향' : '영향없음'}
                            </p>
                          </div>
                        </div>

                        {tweet.reason && (
                          <div>
                            <span className="text-xs font-medium text-muted-foreground">영향 설명</span>
                            <p className="text-sm text-foreground mt-1 leading-relaxed">{tweet.reason}</p>
                          </div>
                        )}

                        {tweet.url && (
                          <div className="pt-2">
                            <Button variant="outline" size="sm" onClick={(e) => { e.stopPropagation(); window.open(tweet.url, '_blank'); }} className="gap-2">
                              <ExternalLink className="h-3 w-3" />
                              원본 트윗 보기
                            </Button>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                )}
              </Fragment>
            ))}
          </tbody>
        </table>
      </div>

      {tweets.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          <p className="text-sm">표시할 트윗이 없습니다</p>
        </div>
      )}

      {tweets.length > ITEMS_PER_PAGE && (
        <div className="border-t bg-muted/30 px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              총 {sortedTweets.length.toLocaleString()}개 중 {startIndex + 1}-{Math.min(endIndex, sortedTweets.length)} 표시
            </div>

            <div className="flex items-center gap-1">
              <Button variant="outline" size="sm" onClick={() => handlePageChange(clampedPage - 1)} disabled={clampedPage === 1} className="gap-1">
                <ChevronLeft className="h-3 w-3" />
                이전
              </Button>

              <div className="flex gap-1">
                {getPageNumbers().map((page, index) => typeof page === 'number' ? (
                  <Button key={page} variant={clampedPage === page ? 'default' : 'outline'} size="sm" onClick={() => handlePageChange(page)} className="min-w-9">{page}</Button>
                ) : (
                  <span key={`ellipsis-${index}`} className="px-2 py-1 text-muted-foreground">{page}</span>
                ))}
              </div>

              <Button variant="outline" size="sm" onClick={() => handlePageChange(clampedPage + 1)} disabled={clampedPage === totalPages} className="gap-1">
                다음
                <ChevronRight className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

