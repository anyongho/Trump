import * as XLSX from 'xlsx';
import { Tweet } from '@shared/schema';
import { randomUUID } from 'crypto';

export interface ParsedExcelData {
  tweets: Tweet[];
  totalRows: number;
  errors: string[];
}

export function parseExcelFile(buffer: Buffer): ParsedExcelData {
  const errors: string[] = [];
  const tweets: Tweet[] = [];

  try {
    // Read the Excel file
    const workbook = XLSX.read(buffer, { type: 'buffer' });
    
    // Get the first sheet (Sheet1)
    const sheetName = workbook.SheetNames[0];
    if (!sheetName) {
      throw new Error('No sheets found in Excel file');
    }

    const worksheet = workbook.Sheets[sheetName];
    
    // Convert to JSON with header row
    const rawData: any[] = XLSX.utils.sheet_to_json(worksheet, {
      raw: false, // Get formatted strings instead of raw values
      defval: '', // Default value for empty cells
    });

    const totalRows = rawData.length;

    // Parse each row
    rawData.forEach((row, index) => {
      try {
        // Parse numeric scores, preserving 0.0 values
        const sentimentScore = parseFloat(row.sentiment_score);
        const marketImpactScore = parseFloat(row.market_impact_score);

        const tweet: Tweet = {
          id: randomUUID(),
          timestr: row.timestr || row.time || '',
          time: row.time || row.timestr || '',
          content: row.content || '',
          url: row.url || '',
          platform: row.platform || '',
          originaltweet: row.originaltweet || '',
          impactonmarket: row.impact_on_market || '',
          sentimentscore: isNaN(sentimentScore) ? undefined : sentimentScore,
          marketimpactscore: isNaN(marketImpactScore) ? undefined : marketImpactScore,
          keywords: row.keywords || '',
          sector: row.sector || '',
          reason: row.reason || '',
        };

        // Validate required fields
        if (!tweet.timestr || !tweet.content) {
          errors.push(`Row ${index + 2}: Missing required fields (timestr or content)`);
          return;
        }

        tweets.push(tweet);
      } catch (error) {
        errors.push(`Row ${index + 2}: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    });

    return {
      tweets,
      totalRows,
      errors,
    };
  } catch (error) {
    throw new Error(`Failed to parse Excel file: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}
