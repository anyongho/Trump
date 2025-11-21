import { useState } from "react";
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
  const [sentimentRange, setSentimentRange] = useState<number[]>([
    filters.sentimentMin ?? -1,
    filters.sentimentMax ?? 1
  ]);
  
  const [searchKeyword, setSearchKeyword] = useState("");

  const updateFilter = (key: keyof TweetFilter, value: any) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const toggleSector = (sector: string) => {
    const quotedSector = `'${sector}'`;
    const current = filters.sectors || [];
    const updated = current.includes(quotedSector)
      ? current.filter(s => s !== quotedSector)
      : [...current, quotedSector];
    updateFilter('sectors', updated);
  };

  const toggleKeyword = (keyword: string) => {
    const current = filters.keywords || [];
    const updated = current.includes(keyword)
      ? current.filter(k => k !== keyword)
      : [...current, keyword];
    updateFilter('keywords', updated);
  };

  const toggleImpactCategory = (category: string) => {
    const current = filters.impactCategory || [];
    const updated = current.includes(category)
      ? current.filter(c => c !== category)
      : [...current, category];
    updateFilter('impactCategory', updated);
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
          <Accordion type="multiple" defaultValue={["date", "sentiment", "impact", "sector"]} className="space-y-4 py-6">
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
                    value={filters.dateFrom || ''}
                    onChange={(e) => updateFilter('dateFrom', e.target.value)}
                    data-testid="input-date-from"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="date-to" className="text-xs font-medium">
                    종료일
                  </Label>
                  <Input
                    id="date-to"
                    type="date"
                    value={filters.dateTo || ''}
                    onChange={(e) => updateFilter('dateTo', e.target.value)}
                    data-testid="input-date-to"
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
                      updateFilter('sentimentMin', value[0]);
                      updateFilter('sentimentMax', value[1]);
                    }}
                    data-testid="slider-sentiment"
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
                      checked={(filters.impactCategory || []).includes(category)}
                      onCheckedChange={() => toggleImpactCategory(category)}
                      data-testid={`checkbox-impact-${category.toLowerCase()}`}
                    />
                    <Label
                      htmlFor={`impact-${category}`}
                      className="text-sm font-normal cursor-pointer"
                    >
                      {category === 'Direct' ? '직접' : category === 'Indirect' ? '간접' : '없음'}
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
                    {['Financials', 'Information Technology', 'Health Care', 'Consumer Discretionary', 'Communication Services', 'Industrials', 'Consumer Staples', 'Energy', 'Real Estate', 'Materials', 'Utilities'].map((sector) => (
                      <div key={sector} className="flex items-center space-x-2">
                        <Checkbox
                          id={`sector-${sector}`}
                          checked={(filters.sectors || []).includes(`'${sector}'`)}
                          onCheckedChange={() => toggleSector(sector)}
                          data-testid={`checkbox-sector-${sector}`}
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
                    data-testid="input-keyword-search"
                    className="pr-8"
                  />
                  {searchKeyword && (
                    <button
                      onClick={() => setSearchKeyword('')}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      data-testid="button-clear-keyword-search"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>
                <ScrollArea className="h-48">
                  <div className="space-y-3">
                    {filteredKeywords.map((keyword) => (
                      <div key={keyword} className="flex items-center space-x-2">
                        <Checkbox
                          id={`keyword-${keyword}`}
                          checked={(filters.keywords || []).includes(keyword)}
                          onCheckedChange={() => toggleKeyword(keyword)}
                          data-testid={`checkbox-keyword-${keyword}`}
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
          <Button
            onClick={onApply}
            className="w-full"
            data-testid="button-apply-filters"
          >
            필터 적용
          </Button>
          <Button
            onClick={onReset}
            variant="outline"
            className="w-full"
            data-testid="button-reset-filters"
          >
            초기화
          </Button>
        </div>
      </div>
    </div>
  );
}
