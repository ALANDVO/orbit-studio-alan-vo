import { useState, useEffect } from 'react';
import { IssuePhase, IssueListResponse, ListIssuesParams, fetchIssues } from './api';

// Helper to get enum values
const issuePhaseValues = Object.values(IssuePhase) as IssuePhase[];

export default function IssueList() {
  const [issues, setIssues] = useState<IssueListResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filter state
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [phase, setPhase] = useState<IssuePhase | undefined>(undefined);
  const [search, setSearch] = useState('');

  // Fetch issues on mount and when filters change
  useEffect(() => {
    async function loadIssues() {
      try {
        setLoading(true);
        const data = await fetchIssues({ page, page_size: pageSize, phase, search });
        setIssues(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    }
    loadIssues();
  }, [page, pageSize, phase, search]);

  // Handlers for filters
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setPage(1); // reset page on search
  };

  const handlePhaseChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    setPhase(val ? (val as IssuePhase) : undefined);
    setPage(1);
  };

  const handlePageChange = (delta: number) => {
    setPage(prev => Math.max(1, prev + delta));
  };

  if (loading) return <div className="loading">Loading issues...</div>;
  if (error) return <div className="error">Error: {error}</div>;
  if (!issues) return <div className="empty">No data</div>;

  return (
    <div className="issue-list">
      <h2>Issues</h2>
      <div className="filters">
        <input
          type="text"
          placeholder="Search..."
          value={search}
          onChange={handleSearchChange}
        />
        <select value={phase ?? ''} onChange={handlePhaseChange}>
          <option value="">All phases</option>
          {issuePhaseValues.map(p => (
            <option key={p} value={p}>{p}</option>
          ))}
        </select>
      </div>

      <ul>
        {issues.items.map(issue => (
          <li key={issue.id}>
            <strong>{issue.title}</strong> - {issue.phase} ({new Date(issue.created_at).toLocaleDateString()})
          </li>
        ))}
      </ul>

      <div className="pagination">
        <button onClick={() => handlePageChange(-1)} disabled={page === 1}>Previous</button>
        <span>Page {issues.page} of {issues.total_pages}</span>
        <button onClick={() => handlePageChange(1)} disabled={page === issues.total_pages}>Next</button>
      </div>
    </div>
  );
}
