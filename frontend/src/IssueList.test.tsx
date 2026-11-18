import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import IssueList from './IssueList';
import { fetchIssues } from './api';

// Mock the api module
vi.mock('./api', () => ({
  fetchIssues: vi.fn(),
  IssuePhase: {
    BACKLOG: 'backlog',
    TRIAGE: 'triage',
    IN_PROGRESS: 'in_progress',
    REVIEW: 'review',
    DONE: 'done',
  },
  IssueResponse: {},
  IssueListResponse: {},
  ListIssuesParams: {},
}));

describe('IssueList', () => {
  it('shows loading state initially', () => {
    const promise = Promise.resolve();
    vi.mocked(fetchIssues).mockReturnValue(promise);
    render(<IssueList />);
    expect(screen.getByText('Loading issues...')).toBeInTheDocument();
  });

  it('displays issue list when fetch succeeds', async () => {
    const mockResponse: any = {
      items: [
        { id: 1, title: 'Test Issue', phase: 'backlog', created_at: '2024-01-01', updated_at: '2024-01-01' },
      ],
      total: 1,
      page: 1,
      page_size: 20,
      total_pages: 1,
    };
    vi.mocked(fetchIssues).mockResolvedValue(mockResponse);
    render(<IssueList />);
    await waitFor(() => {
      expect(screen.getByText('Test Issue')).toBeInTheDocument();
      expect(screen.getByText('backlog')).toBeInTheDocument();
    });
  });
});
