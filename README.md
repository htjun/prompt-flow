# Image Prompt Flow

A visual tool for creating and improving image generation prompts using AI. This flow-based interface allows you to iteratively refine your prompts through AI enhancement, structured decomposition, and immediate visual feedback through image generation.

## Getting Started

1. Start with a Prompt Node and enter your initial idea
2. Use the Enhance button to create an Enhanced Prompt Node
3. Use the Atomize button to break down a prompt
4. Generate images from any node using the Generate button
5. Connect nodes to build complex prompt engineering workflows

## Environment Setup

Create a `.env.local` file in the root directory with the following variables:

```
NEXT_PUBLIC_OPENAI_API_KEY=your_openai_api_key
NEXT_PUBLIC_REPLICATE_API_TOKEN=your_replicate_api_token
```

## Technologies

- Next.js (App Router)
- React
- TypeScript
- React Flow
- Tailwind CSS
- Jest + React Testing Library

## Development

```bash
# Install dependencies
pnpm install

# Run the development server with Turbopack
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start

# Run tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Run tests with coverage
pnpm test:coverage
```

## Testing

This project uses Jest with React Testing Library for testing. Tests are located in `__tests__` directories next to the code they test:

- Unit tests for utilities: `src/lib/__tests__/`
- Store tests: `src/stores/__tests__/`

## License

MIT
