import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import App from './App'

const mockFetch = vi.fn()
global.fetch = mockFetch

describe('App', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('shows loading state initially', () => {
    const { promise } = Promise.withResolvers()
    mockFetch.mockReturnValue(promise)
    render(<App />)
    expect(screen.getByText('Loading...')).toBeInTheDocument()
  })

  it('displays health data when fetch succeeds', async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => ({
        status: 'ok',
        version: '1.0.0',
        environment: 'development',
        demo_mode: false
      })
    })
    render(<App />)
    await waitFor(() => {
      expect(screen.getByText('System Health')).toBeInTheDocument()
      expect(screen.getByText('ok')).toBeInTheDocument()
      expect(screen.getByText('1.0.0')).toBeInTheDocument()
      expect(screen.getByText('development')).toBeInTheDocument()
      expect(screen.getByText('Disabled')).toBeInTheDocument()
    })
  })

  it('displays error when fetch fails', async () => {
    mockFetch.mockRejectedValue(new Error('Network error'))
    render(<App />)
    await waitFor(() => {
      expect(screen.getByText('Error: Network error')).toBeInTheDocument()
    })
  })
})