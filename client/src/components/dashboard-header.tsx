import { RefreshCw, Database } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatDistanceToNow } from "date-fns";
import { ko } from "date-fns/locale";

interface DashboardHeaderProps {
  lastUpdated: Date | null;
  onRefresh: () => void;
  isRefreshing?: boolean;
}

export function DashboardHeader({ lastUpdated, onRefresh, isRefreshing }: DashboardHeaderProps) {
  return (
    <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-16 items-center justify-between px-8 py-4">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold text-foreground leading-tight">
            트럼프 트윗 분석 대시보드
          </h1>
          <div className="flex items-center gap-2 px-3 py-1 rounded-md bg-muted text-sm text-muted-foreground">
            <Database className="h-3.5 w-3.5" />
            <span>merged_all_excel.xlsx</span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {lastUpdated && (
            <div className="text-sm text-muted-foreground" data-testid="text-last-updated">
              마지막 업데이트: {formatDistanceToNow(lastUpdated, { addSuffix: true, locale: ko })}
            </div>
          )}
          
          <Button
            variant="outline"
            size="default"
            onClick={onRefresh}
            disabled={isRefreshing}
            data-testid="button-refresh"
            className="gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            새로고침
          </Button>
        </div>
      </div>
    </header>
  );
}
