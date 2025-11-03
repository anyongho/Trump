import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Download } from "lucide-react";
import { Tweet } from "@shared/schema";
import { utils, writeFile } from 'xlsx';
import Papa from 'papaparse';

interface ExportControlsProps {
  tweets: Tweet[];
  totalCount: number;
}

export function ExportControls({ tweets, totalCount }: ExportControlsProps) {
  const [format, setFormat] = useState<'csv' | 'excel'>('csv');

  const handleExport = () => {
    if (tweets.length === 0) return;

    const exportData = tweets.map(tweet => ({
      '날짜/시간': tweet.timestr,
      '내용': tweet.content,
      'URL': tweet.url,
      '플랫폼': tweet.platform || '',
      '원본트윗': tweet.originaltweet || '',
      '시장영향도': tweet.impactonmarket || '',
      '감정점수': tweet.sentimentscore?.toString() || '',
      '시장영향점수': tweet.marketimpactscore?.toString() || '',
      '키워드': tweet.keywords || '',
      '섹터': tweet.sector || '',
      '설명': tweet.reason || '',
    }));

    if (format === 'csv') {
      const csv = Papa.unparse(exportData);
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `trump_tweets_${new Date().toISOString().split('T')[0]}.csv`;
      link.click();
    } else {
      const worksheet = utils.json_to_sheet(exportData);
      const workbook = utils.book_new();
      utils.book_append_sheet(workbook, worksheet, 'Tweets');
      writeFile(workbook, `trump_tweets_${new Date().toISOString().split('T')[0]}.xlsx`);
    }
  };

  return (
    <div className="flex items-center gap-4 p-4 bg-card rounded-lg border">
      <div className="flex-1">
        <Label className="text-sm font-medium text-foreground mb-2 block">
          내보내기 형식
        </Label>
        <RadioGroup value={format} onValueChange={(v) => setFormat(v as 'csv' | 'excel')} className="flex gap-4">
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="csv" id="csv" data-testid="radio-format-csv" />
            <Label htmlFor="csv" className="text-sm font-normal cursor-pointer">
              CSV
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="excel" id="excel" data-testid="radio-format-excel" />
            <Label htmlFor="excel" className="text-sm font-normal cursor-pointer">
              Excel
            </Label>
          </div>
        </RadioGroup>
      </div>

      <div className="flex items-center gap-3">
        <div className="text-sm text-muted-foreground" data-testid="text-export-count">
          {tweets.length} / {totalCount} 트윗
        </div>
        <Button
          onClick={handleExport}
          disabled={tweets.length === 0}
          data-testid="button-export"
          className="gap-2"
        >
          <Download className="h-4 w-4" />
          다운로드
        </Button>
      </div>
    </div>
  );
}
