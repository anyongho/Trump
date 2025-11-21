import { useEffect, useState } from "react";
import { format, subDays } from "date-fns";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Calendar, Filter, X } from "lucide-react";
import { TweetFilter } from "@shared/schema";

interface FilterSidebarProps {
  filters: TweetFilter;
  onFiltersChange: (filters: TweetFilter) => void;
  availableSectors: string[];
  availableKeywords: string[];
  onApply: () => void;
  onReset: () => void;
}

export function FilterSidebar({
  filters,
  onFiltersChange,
  availableSectors,
  availableKeywords,
  onApply,
  onReset,
}: FilterSidebarProps) {
  // 오늘 날짜와 30일 전 날짜 계산
  const today = new Date();
  const thirtyDaysAgo = subDays(today, 30);

  // filters 초기값: props.filters가 없으면 30일 기준 자동 설정
  const [localFilters, setLocalFilters] = useState<TweetFilter>({
    ...filters,
    dateFrom: filters.dateFrom || format(thirtyDaysAgo, "yyyy-MM-dd"),
    dateTo: filters.dateTo || format(today, "yyyy-MM-dd"),
  });

  const [sentimentRange, setSentimentRange] = useState<number[]>([
    localFilters.sentimentMin ?? -1,
    localFilters.sentimentMax ?? 1
  ]);
  
  const [searchKeyword, setSearchKeyword] = useState("");

  const updateFilters = (partial: Partial<TweetFilter>) => {
    setLocalFilters((prev) => {
      const updated = {
        ...prev,
        ...partial,
      };
      onFiltersChange(updated);
      return updated;
    });
  };

  useEffect(() => {
    const now = new Date();
    const defaultFrom = format(subDays(now, 30), "yyyy-MM-dd");
    const defaultTo = format(now, "yyyy-MM-dd");

    setLocalFilters({
      ...filters,
      dateFrom: filters.dateFrom || defaultFrom,
      dateTo: filters.dateTo || defaultTo,
    });

    setSentimentRange([
      filters.sentimentMin ?? -1,
      filters.sentimentMax ?? 1,
    ]);
  }, [filters]);

  const toggleSector = (sector: string) => {
    const current = localFilters.sectors || [];
    const updated = current.includes(sector)
      ? current.filter(s => s !== sector)
      : [...current, sector];
    updateFilters({ sectors: updated });
  };

  const toggleKeyword = (keyword: string) => {
    const current = localFilters.keywords || [];
    const updated = current.includes(keyword)
      ? current.filter(k => k !== keyword)
      : [...current, keyword];
    updateFilters({ keywords: updated });
  };

  const toggleImpactCategory = (category: string) => {
    const current = localFilters.impactCategory || [];
    const updated = current.includes(category)
      ? current.filter(c => c !== category)
      : [...current, category];
    updateFilters({ impactCategory: updated });
  };

  const filteredKeywords = availableKeywords.filter(kw => 
    kw.toLowerCase().includes(searchKeyword.toLowerCase())
  ).slice(0, 50);

  return (
    <div className="h-full border-r bg-sidebar">
      <div className="sticky top-16 h-[calc(100vh-4rem)] flex flex-col">
        <div className="p-6 border-b">
          <div className="flex items-center gap-2">
            <Filter className="h-5 w-5 text-sidebar-foreground" />
            <h2 className="text-lg font-semibold text-sidebar-foreground">필터</h2>
          </div>
        </div>

        <ScrollArea className="flex-1 px-6">
          <Accordion type="multiple" defaultValue={["date", "sentiment", "impact", "sector", "keywords"]} className="space-y-4 py-6">

            {/* Date Range Filter */}
            <AccordionItem value="date" className="border rounded-lg px-4">
              <AccordionTrigger className="text-sm font-semibold hover:no-underline">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  날짜 범위
                </div>
              </AccordionTrigger>
              <AccordionContent className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label htmlFor="date-from" className="text-xs font-medium">
                    시작일
                  </Label>
                  <Input
                    id="date-from"
                    type="date"
                    value={localFilters.dateFrom || ''}
                    onChange={(e) => updateFilters({ dateFrom: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="date-to" className="text-xs font-medium">
                    종료일
                  </Label>
                  <Input
                    id="date-to"
                    type="date"
                    value={localFilters.dateTo || ''}
                    onChange={(e) => updateFilters({ dateTo: e.target.value })}
                  />
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* Sentiment Score Filter */}
            <AccordionItem value="sentiment" className="border rounded-lg px-4">
              <AccordionTrigger className="text-sm font-semibold hover:no-underline">
                감정 점수
              </AccordionTrigger>
              <AccordionContent className="space-y-4 pt-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono text-muted-foreground">
                      {sentimentRange[0].toFixed(2)}
                    </span>
                    <span className="text-xs font-mono text-muted-foreground">
                      {sentimentRange[1].toFixed(2)}
                    </span>
                  </div>
                  <Slider
                    min={-1}
                    max={1}
                    step={0.01}
                    value={sentimentRange}
                    onValueChange={(value) => {
                      setSentimentRange(value);
                      updateFilters({
                        sentimentMin: value[0],
                        sentimentMax: value[1],
                      });
                    }}
                    className="w-full"
                  />
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* Market Impact Filter */}
            <AccordionItem value="impact" className="border rounded-lg px-4">
              <AccordionTrigger className="text-sm font-semibold hover:no-underline">
                시장 영향도
              </AccordionTrigger>
              <AccordionContent className="space-y-3 pt-4">
                {['Direct', 'Indirect', 'None'].map((category) => (
                  <div key={category} className="flex items-center space-x-2">
                    <Checkbox
                      id={`impact-${category}`}
                      checked={(localFilters.impactCategory || []).includes(category)}
                      onCheckedChange={() => toggleImpactCategory(category)}
                    />
                    <Label
                      htmlFor={`impact-${category}`}
                      className="text-sm font-normal cursor-pointer"
                    >
                      {category === 'Direct' ? '직접' : category === 'Indirect' ? '간접' : '영향없음'}
                    </Label>
                  </div>
                ))}
              </AccordionContent>
            </AccordionItem>

            {/* Sector Filter */}
            <AccordionItem value="sector" className="border rounded-lg px-4">
              <AccordionTrigger className="text-sm font-semibold hover:no-underline">
                섹터
              </AccordionTrigger>
              <AccordionContent className="pt-4">
                <ScrollArea className="h-48">
                  <div className="space-y-3">
                    {availableSectors.map((sector) => (
                      <div key={sector} className="flex items-center space-x-2">
                        <Checkbox
                          id={`sector-${sector}`}
                          checked={(localFilters.sectors || []).includes(sector)}
                          onCheckedChange={() => toggleSector(sector)}
                        />
                        <Label
                          htmlFor={`sector-${sector}`}
                          className="text-sm font-normal cursor-pointer leading-tight"
                        >
                          {sector}
                        </Label>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </AccordionContent>
            </AccordionItem>

            {/* Keywords Filter */}
            <AccordionItem value="keywords" className="border rounded-lg px-4">
              <AccordionTrigger className="text-sm font-semibold hover:no-underline">
                키워드
              </AccordionTrigger>
              <AccordionContent className="space-y-4 pt-4">
                <div className="relative">
                  <Input
                    placeholder="키워드 검색..."
                    value={searchKeyword}
                    onChange={(e) => setSearchKeyword(e.target.value)}
                    className="pr-8"
                  />
                  {searchKeyword && (
                    <button
                      onClick={() => setSearchKeyword('')}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>
                <ScrollArea className="h-48">
                  <div className="space-y-3">
                    {availableKeywords.filter(kw => kw.toLowerCase().includes(searchKeyword.toLowerCase())).slice(0, 50).map((keyword) => (
                      <div key={keyword} className="flex items-center space-x-2">
                        <Checkbox
                          id={`keyword-${keyword}`}
                          checked={(localFilters.keywords || []).includes(keyword)}
                          onCheckedChange={() => toggleKeyword(keyword)}
                        />
                        <Label
                          htmlFor={`keyword-${keyword}`}
                          className="text-sm font-normal cursor-pointer leading-tight"
                        >
                          {keyword}
                        </Label>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </ScrollArea>

        <div className="p-6 border-t space-y-2">
          <Button onClick={onApply} className="w-full">필터 적용</Button>
          <Button onClick={onReset} variant="outline" className="w-full">초기화</Button>
        </div>
      </div>
    </div>
  );
}
