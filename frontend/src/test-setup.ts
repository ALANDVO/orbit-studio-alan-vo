import '@testing-library/jest-dom'
import { vi } from 'vitest'

const mockFetch = vi.fn()
global.fetch = mockFetch

export const resetFetchMock = () => {
  mockFetch.mockReset()
}