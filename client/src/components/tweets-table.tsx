import { useState, Fragment } from "react";
import { Tweet } from "@shared/schema";
import { ChevronDown, ChevronUp, ArrowUpDown, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { format, parseISO } from "date-fns";

interface TweetsTableProps {
  tweets: Tweet[];
  onTweetClick: (tweet: Tweet) => void;
}

type SortField = 'timestr' | 'sentimentscore' | 'marketimpactscore' | 'impactonmarket';
type SortDirection = 'asc' | 'desc';

export function TweetsTable({ tweets, onTweetClick }: TweetsTableProps) {
  const [expandedRow, setExpandedRow] = useState<string | null>(null);
  const [sortField, setSortField] = useState<SortField>('timestr');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

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
    
    if (sortField === 'timestr') {
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

  const formatDate = (dateStr: string) => {
    try {
      return format(parseISO(dateStr), 'yyyy-MM-dd HH:mm');
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

  return (
    <div className="rounded-lg border bg-card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted/50 sticky top-0 z-10">
            <tr className="border-b">
              <th className="text-left text-sm font-medium text-muted-foreground px-4 py-3">
                <button
                  onClick={() => handleSort('timestr')}
                  className="flex items-center gap-1 hover:text-foreground transition-colors"
                  data-testid="sort-date"
                >
                  날짜/시간
                  <ArrowUpDown className="h-3 w-3" />
                </button>
              </th>
              <th className="text-left text-sm font-medium text-muted-foreground px-4 py-3">
                트윗 내용
              </th>
              <th className="text-left text-sm font-medium text-muted-foreground px-4 py-3">
                플랫폼
              </th>
              <th className="text-left text-sm font-medium text-muted-foreground px-4 py-3">
                <button
                  onClick={() => handleSort('impactonmarket')}
                  className="flex items-center gap-1 hover:text-foreground transition-colors"
                  data-testid="sort-impact"
                >
                  영향도
                  <ArrowUpDown className="h-3 w-3" />
                </button>
              </th>
              <th className="text-left text-sm font-medium text-muted-foreground px-4 py-3">
                <button
                  onClick={() => handleSort('sentimentscore')}
                  className="flex items-center gap-1 hover:text-foreground transition-colors"
                  data-testid="sort-sentiment"
                >
                  감정
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
            {sortedTweets.map((tweet) => (
              <Fragment key={tweet.id}>
                <tr
                  className="border-b hover-elevate cursor-pointer transition-colors"
                  onClick={() => setExpandedRow(expandedRow === tweet.id ? null : tweet.id)}
                  data-testid={`row-tweet-${tweet.id}`}
                >
                  <td className="px-4 py-3 text-sm font-mono text-foreground">
                    {formatDate(tweet.timestr)}
                  </td>
                  <td className="px-4 py-3 text-sm text-foreground max-w-md">
                    <div className="line-clamp-2 leading-relaxed">
                      {tweet.content}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">
                    {tweet.platform || '-'}
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant={getImpactBadgeVariant(tweet.impactonmarket)}>
                      {tweet.impactonmarket === 'Direct' ? '직접' : 
                       tweet.impactonmarket === 'Indirect' ? '간접' : 
                       tweet.impactonmarket || '-'}
                    </Badge>
                  </td>
                  <td className={`px-4 py-3 text-sm font-mono font-semibold ${getSentimentColor(tweet.sentimentscore)}`}>
                    {tweet.sentimentscore !== undefined ? tweet.sentimentscore.toFixed(2) : '-'}
                  </td>
                  <td className="px-4 py-3 text-sm text-muted-foreground max-w-xs">
                    <div className="line-clamp-1">
                      {tweet.sector || '-'}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-center">
                    {expandedRow === tweet.id ? (
                      <ChevronUp className="h-4 w-4 mx-auto text-muted-foreground" />
                    ) : (
                      <ChevronDown className="h-4 w-4 mx-auto text-muted-foreground" />
                    )}
                  </td>
                </tr>
                {expandedRow === tweet.id && (
                  <tr className="bg-muted/30" data-testid={`expanded-tweet-${tweet.id}`}>
                    <td colSpan={7} className="px-4 py-6">
                      <div className="space-y-4 max-w-4xl">
                        <div>
                          <h4 className="text-sm font-semibold text-foreground mb-2">전체 내용</h4>
                          <p className="text-sm text-foreground leading-relaxed">
                            {tweet.content}
                          </p>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <span className="text-xs font-medium text-muted-foreground">키워드</span>
                            <p className="text-sm text-foreground mt-1">
                              {tweet.keywords || '-'}
                            </p>
                          </div>
                          <div>
                            <span className="text-xs font-medium text-muted-foreground">섹터</span>
                            <p className="text-sm text-foreground mt-1">
                              {tweet.sector || '-'}
                            </p>
                          </div>
                          <div>
                            <span className="text-xs font-medium text-muted-foreground">시장 영향 점수</span>
                            <p className="text-sm font-mono text-foreground mt-1">
                              {tweet.marketimpactscore !== undefined ? tweet.marketimpactscore.toFixed(2) : '-'}
                            </p>
                          </div>
                          <div>
                            <span className="text-xs font-medium text-muted-foreground">원본 트윗 여부</span>
                            <p className="text-sm text-foreground mt-1">
                              {tweet.originaltweet || '-'}
                            </p>
                          </div>
                        </div>
                        
                        {tweet.reason && (
                          <div>
                            <span className="text-xs font-medium text-muted-foreground">영향 설명</span>
                            <p className="text-sm text-foreground mt-1 leading-relaxed">
                              {tweet.reason}
                            </p>
                          </div>
                        )}
                        
                        {tweet.url && (
                          <div className="pt-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                window.open(tweet.url, '_blank');
                              }}
                              data-testid={`button-view-original-${tweet.id}`}
                              className="gap-2"
                            >
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
    </div>
  );
}
