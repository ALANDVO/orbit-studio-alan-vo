import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import IssueList from './IssueList';

// HealthView component
interface HealthResponse {
  status: string;
  version: string;
  environment: string;
  demo_mode: boolean;
}

function HealthView() {
  const [health, setHealth] = useState<HealthResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchHealth() {
      try {
        const response = await fetch('/health');
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const data = await response.json();
        setHealth(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    }
    fetchHealth();
  }, []);

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">Error: {error}</div>;
  if (!health) return <div className="empty">No data</div>;

  return (
    <div className="app">
      <header>
        <h1>Orbit Studio</h1>
        <p>AI Engineering Issue Tracker</p>
      </header>
      <main>
        <section className="health-card">
          <h2>System Health</h2>
          <dl>
            <dt>Status</dt>
            <dd className={health.status === 'ok' ? 'status-ok' : 'status-error'}>{health.status}</dd>
            <dt>Version</dt>
            <dd>{health.version}</dd>
            <dt>Environment</dt>
            <dd>{health.environment}</dd>
            <dt>Demo Mode</dt>
            <dd>{health.demo_mode ? 'Enabled' : 'Disabled'}</dd>
          </dl>
        </section>
      </main>
      <footer>
        <p>{'Alan Vo <alanvo@gmail.com> | AI & Machine Learning'}</p>
      </footer>
    </div>
  );
}

// Router component exported as default
export default function App() {
  return (
    <BrowserRouter>
      <nav style={{ padding: '1rem', background: '#f0f0f0' }}>
        <Link to="/">Health</Link> | <Link to="/issues">Issues</Link>
      </nav>
      <Routes>
        <Route path="/" element={<HealthView />} />
        <Route path="/issues" element={<IssueList />} />
      </Routes>
    </BrowserRouter>
  );
}
