export interface SearchQuery {
  keyword: string;
  filters?: Record<string, any>;
  page?: number;
  limit?: number;
  sort?: { field: string; order: 'ASC' | 'DESC' }[];
}

export interface SearchResult<T> {
  hits: T[];
  total: number;
  tookMs: number;
}

export class SearchFramework {
  public async search<T>(index: string, query: SearchQuery): Promise<SearchResult<T>> {
    const start = Date.now();
    // Mock search implementation
    return {
      hits: [],
      total: 0,
      tookMs: Date.now() - start
    };
  }
}
export const searchFramework = new SearchFramework();
