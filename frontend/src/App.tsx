import { useState, useEffect } from 'react'

interface HealthResponse {
  status: string
  version: string
  environment: string
  demo_mode: boolean
}

function App() {
  const [health, setHealth] = useState<HealthResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchHealth() {
      try {
        const response = await fetch('/health')
        if (!response.ok) throw new Error(`HTTP ${response.status}`)
        const data = await response.json()
        setHealth(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error')
      } finally {
        setLoading(false)
      }
    }
    fetchHealth()
  }, [])

  if (loading) return <div className="loading">Loading...</div>
  if (error) return <div className="error">Error: {error}</div>
  if (!health) return <div className="empty">No data</div>

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
  )
}

export default App