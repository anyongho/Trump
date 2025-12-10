import { FileSpreadsheet, AlertCircle } from "lucide-react";

export function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center min-h-96 p-8 text-center">
      <div className="rounded-full bg-muted p-6 mb-6">
        <FileSpreadsheet className="h-12 w-12 text-muted-foreground" />
      </div>
      <h3 className="text-2xl font-semibold text-foreground mb-2">
        데이터가 없습니다
      </h3>
      <p className="text-muted-foreground mb-4 max-w-md leading-relaxed">
        Supabase 데이터베이스에 트윗 데이터가 없습니다.
      </p>
      <div className="flex items-start gap-2 p-4 bg-muted/50 rounded-md text-sm text-muted-foreground max-w-md">
        <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
        <p className="text-left">
          데이터베이스 연결을 확인하거나, 스크래핑 및 분석 프로세스를 실행하여 데이터를 추가하세요.
        </p>
      </div>
    </div>
  );
}
