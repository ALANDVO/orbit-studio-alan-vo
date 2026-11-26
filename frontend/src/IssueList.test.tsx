import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor, act } from '@testing-library/react';
import IssueList from './IssueList';
import { fetchIssues } from './api';

// Mock the api module
vi.mock('./api', () => {
  const mockFetchIssues = vi.fn();
  return {
    fetchIssues: mockFetchIssues,
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
  };
});

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

  it('applies phase filter when phase select changes', async () => {
    const mockFetchIssues = vi.mocked(fetchIssues);

    // Mock returns backlog issues when phase=backlog, triage otherwise
    mockFetchIssues.mockImplementation((params: any) => {
      if (params.phase === 'backlog') {
        return Promise.resolve({
          items: [
            { id: 1, title: 'Backlog Issue', phase: 'backlog', created_at: '2024-01-01', updated_at: '2024-01-01' },
          ],
          total: 1,
          page: 1,
          page_size: 20,
          total_pages: 1,
        });
      }
      return Promise.resolve({
        items: [
          { id: 1, title: 'Triage Issue', phase: 'triage', created_at: '2024-01-02', updated_at: '2024-01-02' },
        ],
        total: 1,
        page: 1,
        page_size: 20,
        total_pages: 1,
      });
    });

    render(<IssueList />);
    // Initially shows all phases (undefined filter), wait for initial fetch
    await waitFor(() => {
      expect(screen.getByText('Triage Issue')).toBeInTheDocument();
    });

    // Change phase to 'backlog' via the select (use combobox role per Testing Library)
    const phaseSelect = screen.getByRole('combobox');
    act(() => {
      phaseSelect.value = 'backlog';
      phaseSelect.dispatchEvent(new Event('change', { bubbles: true }));
    });

    // Wait for the re-fetch with the new phase filter
    await waitFor(() => {
      // Should show backlog issues
      expect(screen.getByText('Backlog Issue')).toBeInTheDocument();
      // The triage issue should NOT be visible since we filtered by backlog
      expect(screen.queryByText('Triage Issue')).not.toBeInTheDocument();
    });
  });
});
