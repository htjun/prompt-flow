import '@testing-library/jest-dom'

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter() {
    return {
      push: jest.fn(),
      replace: jest.fn(),
      prefetch: jest.fn(),
      back: jest.fn(),
      forward: jest.fn(),
      refresh: jest.fn(),
    }
  },
  useSearchParams() {
    return new URLSearchParams()
  },
  usePathname() {
    return ''
  },
}))

// Mock @xyflow/react for flow-related tests
jest.mock('@xyflow/react', () => ({
  ...jest.requireActual('@xyflow/react'),
  useReactFlow: () => ({
    getNode: (id) => (id === 'a' ? { measured: { width: 10, height: 20 } } : undefined),
  }),
  applyNodeChanges: (_c, nodes) => nodes,
  applyEdgeChanges: (_c, edges) => edges,
}))

// Setup environment variables for tests
process.env.NEXT_PUBLIC_OPENAI_API_KEY = 'test-openai-key'
process.env.NEXT_PUBLIC_GEMINI_API_KEY = 'test-gemini-key'
process.env.NEXT_PUBLIC_REPLICATE_API_TOKEN = 'test-replicate-token'
