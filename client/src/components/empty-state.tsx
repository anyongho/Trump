import { FileSpreadsheet, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EmptyStateProps {
  onUpload: () => void;
}

export function EmptyState({ onUpload }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-96 p-8 text-center">
      <div className="rounded-full bg-muted p-6 mb-6">
        <FileSpreadsheet className="h-12 w-12 text-muted-foreground" />
      </div>
      <h3 className="text-2xl font-semibold text-foreground mb-2">
        데이터가 없습니다
      </h3>
      <p className="text-muted-foreground mb-6 max-w-md leading-relaxed">
        Excel 파일을 업로드하여 트럼프 트윗 분석을 시작하세요.
        merged_all_excel.xlsx 파일을 준비해주세요.
      </p>
      <Button onClick={onUpload} size="lg" className="gap-2" data-testid="button-upload-empty-state">
        <Upload className="h-5 w-5" />
        파일 업로드
      </Button>
    </div>
  );
}
