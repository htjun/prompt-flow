# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Image Prompt Flow is a visual tool for creating and improving image generation prompts using AI. It uses a flow-based interface built with React Flow where users can create nodes to enhance prompts, structure them, and generate images through various AI models.

## Development Commands

```bash
# Install dependencies (uses pnpm)
pnpm install

# Development server with Turbopack
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start

# Linting and formatting
pnpm lint
pnpm format

# Testing
pnpm test              # Run all tests
pnpm test:watch        # Run tests in watch mode
pnpm test:coverage     # Run tests with coverage report

# Storybook (component development)
pnpm storybook         # Dev server on port 6006
pnpm build-storybook   # Build storybook
```

## Architecture Overview

### State Management

- **Zustand stores** for all state management:
  - `flowStore`: Manages React Flow nodes, edges, and flow operations
  - `modelStore`: Tracks selected language and image models
  - `imageStore`: Handles image generation state
  - `promptStore`: Manages prompt-related state

### Core Flow System

- **React Flow** (`@xyflow/react`) provides the visual node-based interface
- **Node Types**: 4 main node types defined in `src/nodes/index.ts`
  - `prompt`: Basic prompt input nodes
  - `enhanced-prompt`: AI-enhanced prompt nodes
  - `structured-prompt-node`: Structured prompt with categories
  - `image`: Generated image display nodes

### Context Architecture

- `FlowActionsContext` provides centralized flow actions (enhance, generate, structure)
- Wraps the main app to provide actions to all nodes and components

### AI Integration

- **Multiple AI providers**: OpenAI, Google (Gemini), Replicate
- **Server actions** in `src/actions/` handle AI operations:
  - `enhancePrompt.ts`: Uses language models to improve prompts
  - `generateImage.ts`: Creates images from prompts
  - `atomizePrompt.ts`: Breaks down prompts into structured data fields
- `segmentPrompt.ts`: Categorizes prompts into natural language segments
  - `describeImage.ts`: Analyzes and describes uploaded images

### Custom Hooks Pattern

All complex logic is abstracted into custom hooks in `src/hooks/`:

- Flow-specific hooks (`useImageGenerationFlow`, `usePromptEnhancementFlow`)
- Action hooks (`usePromptActions`, `useImageActions`)
- Control hooks (`useFlowControls`)

## Testing Strategy

- **Jest + React Testing Library** for unit tests
- Tests located in `__tests__` directories alongside source code
- **Storybook** for component development and visual testing
- Coverage thresholds: 80% branches, 85% functions/lines/statements
- Test files excluded from coverage: stories, mocks, app router files

## Environment Setup

Required environment variables in `.env.local`:

```
NEXT_PUBLIC_OPENAI_API_KEY=your_openai_api_key
NEXT_PUBLIC_REPLICATE_API_TOKEN=your_replicate_api_token
```

## Key Technologies

- **Next.js 15** with App Router
- **React 19** with TypeScript
- **React Flow** for node-based interface
- **Tailwind CSS 4** for styling
- **Radix UI** components
- **AI SDK** (`ai` package) for AI integrations
- **Zod** for schema validation

## Flow Node Positioning

The `flowStore` includes intelligent node positioning logic:

- **Below reference**: enhance, structure, describe actions
- **To the right**: generate actions
- Uses actual node dimensions when available
- 50px gap between nodes

## Model Selection

Default models configured in `modelStore`:

- Language model: `gpt-4.1-mini`
- Image model: `google/imagen-4-fast`

Users can switch between available models through the UI.
