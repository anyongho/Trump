import { useState, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Upload, FileSpreadsheet, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface FileUploadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpload: (file: File) => Promise<void>;
}

export function FileUploadDialog({ open, onOpenChange, onUpload }: FileUploadDialogProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (!file.name.endsWith('.xlsx') && !file.name.endsWith('.xls')) {
        toast({
          title: "잘못된 파일 형식",
          description: "Excel 파일(.xlsx, .xls)만 업로드 가능합니다.",
          variant: "destructive",
        });
        return;
      }
      setSelectedFile(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    try {
      setIsUploading(true);
      await onUpload(selectedFile);
      toast({
        title: "업로드 성공",
        description: "파일이 성공적으로 업로드되었습니다.",
      });
      setSelectedFile(null);
      onOpenChange(false);
    } catch (error) {
      toast({
        title: "업로드 실패",
        description: "파일 업로드 중 오류가 발생했습니다.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    const file = event.dataTransfer.files?.[0];
    if (file && (file.name.endsWith('.xlsx') || file.name.endsWith('.xls'))) {
      setSelectedFile(file);
    } else {
      toast({
        title: "잘못된 파일 형식",
        description: "Excel 파일(.xlsx, .xls)만 업로드 가능합니다.",
        variant: "destructive",
      });
    }
  };

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md" data-testid="dialog-file-upload">
        <DialogHeader>
          <DialogTitle className="text-2xl">Excel 파일 업로드</DialogTitle>
          <DialogDescription>
            merged_all_excel.xlsx 파일을 업로드하여 데이터를 업데이트하세요
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div
            className="border-2 border-dashed rounded-lg p-8 text-center hover-elevate transition-colors cursor-pointer"
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onClick={() => fileInputRef.current?.click()}
            data-testid="dropzone-file-upload"
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".xlsx,.xls"
              onChange={handleFileSelect}
              className="hidden"
              data-testid="input-file"
            />
            
            {selectedFile ? (
              <div className="space-y-3">
                <FileSpreadsheet className="h-12 w-12 mx-auto text-primary" />
                <div className="flex items-center justify-center gap-2">
                  <span className="text-sm font-medium text-foreground">
                    {selectedFile.name}
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedFile(null);
                    }}
                    data-testid="button-remove-file"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  {(selectedFile.size / 1024).toFixed(2)} KB
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                <Upload className="h-12 w-12 mx-auto text-muted-foreground" />
                <div className="space-y-1">
                  <p className="text-sm font-medium text-foreground">
                    파일을 드래그하거나 클릭하여 선택
                  </p>
                  <p className="text-xs text-muted-foreground">
                    .xlsx, .xls 파일만 지원
                  </p>
                </div>
              </div>
            )}
          </div>

          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => {
                setSelectedFile(null);
                onOpenChange(false);
              }}
              className="flex-1"
              data-testid="button-cancel-upload"
            >
              취소
            </Button>
            <Button
              onClick={handleUpload}
              disabled={!selectedFile || isUploading}
              className="flex-1 gap-2"
              data-testid="button-confirm-upload"
            >
              {isUploading ? (
                <>처리 중...</>
              ) : (
                <>
                  <Upload className="h-4 w-4" />
                  업로드
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
