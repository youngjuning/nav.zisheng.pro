export interface WebsiteCategory {
  id: string;
  name: string;
  icon?: string;
  description?: string;
  websites: Website[];
}

export interface Website {
  id: string;
  name: string;
  url: string;
  icon?: string;
  description?: string;
  tags?: string[];
}

export interface SearchParams {
  keyword: string;
  category?: string;
}