export interface RSSItem {
  title: string;
  link: string;
  pubDate: string;
  description: string;
  content?: string;
  contentSnippet?: string;
  content_encoded?: string;
  content_encodedSnippet?: string;
  guid: string;
  isoDate: string;
  blogName: string;
  feedType: 'competitor' | 'noncompetitor';
  matchedKeywords: string[];
  creator?: string;
  'dc:creator'?: string;
  categories?: string[];
  news_letter_sent_date?: string;
  collectedDate?: string;
  author?: string;
}

export interface RSSCollection {
  id: string;
  items: RSSItem[];
  totalCount: number;
  lastUpdated: string;
  source: string;
} 