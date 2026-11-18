export type IssuePhase = 'backlog' | 'triage' | 'in_progress' | 'review' | 'done';

export interface IssueResponse {
  id: number;
  title: string;
  description?: string;
  phase: IssuePhase;
  created_at: string;
  updated_at: string;
}

export interface IssueListResponse {
  items: IssueResponse[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
}

export interface ListIssuesParams {
  page?: number;
  page_size?: number;
  phase?: IssuePhase;
  search?: string;
}

async function fetchIssues(params: ListIssuesParams = {}): Promise<IssueListResponse> {
  const url = new URL('/api/issues', window.location.origin);
  if (params.page) url.searchParams.set('page', params.page.toString());
  if (params.page_size) url.searchParams.set('page_size', params.page_size.toString());
  if (params.phase) url.searchParams.set('phase', params.phase);
  if (params.search) url.searchParams.set('search', params.search);

  const response = await fetch(url.toString());
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }
  return response.json();
}

export { fetchIssues };
