import '@testing-library/jest-dom'

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
process.env.OPENAI_API_KEY = 'test-openai-key'
process.env.REPLICATE_API_TOKEN = 'test-replicate-token'
