# Prompt Flow

A visual node-based tool for creating and improving AI image generation prompts. Build complex prompt engineering workflows using a flow-based interface with real-time AI enhancement and image generation.

![Prompt Flow screenshot](public/screenshot.jpg)

## Features

- **Visual Flow Interface** - Connect nodes to create prompt engineering pipelines
- **AI Prompt Enhancement** - Automatically improve prompts using GPT-4o models
- **Prompt Atomization** - Break down complex prompts into structured components
- **Multi-Model Support** - Generate images using various models (Imagen, Flux, Ideogram, etc.)
- **Image Description** - Analyze and describe uploaded images to create prompts
- **Real-time Preview** - See generated images directly in the flow
- **Memory Management** - Automatic cleanup and optimization for smooth performance

## Quick Start

### Prerequisites

- Node.js 18+ and pnpm
- OpenAI API key (for GPT language models)
- Replicate API token (for image generation models)

### Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/prompt-flow.git
cd prompt-flow
```

2. Install dependencies:

```bash
pnpm install
```

3. Set up environment variables:

```bash
cp .env.example .env.local
```

4. Add your API keys to `.env.local`:

```
OPENAI_API_KEY=your_openai_api_key
REPLICATE_API_TOKEN=your_replicate_api_token
```

5. Start the development server:

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to start creating.

## Usage Guide

### Basic Workflow

1. **Create a Prompt Node** - Right-click on the canvas and select "Add Prompt Node"
2. **Enter Your Idea** - Type your initial prompt idea
3. **Enhance** - Click the Enhance button to improve your prompt with AI
4. **Generate** - Click Generate to create an image from any prompt
5. **Iterate** - Connect nodes to build complex workflows

### Node Types

- **Prompt Node** - Basic text input for prompts
- **Enhanced Prompt Node** - AI-improved version of your prompt
- **Atomized Prompt Node** - Structured breakdown with categories (subject, style, lighting, etc.)
- **Segmented Prompt Node** - Natural language segments of your prompt
- **Image Node** - Displays generated images with download/copy options

### Available Models

**Language Models:**

- GPT-4o
- GPT-4o Mini

**Image Models:**

- Google Imagen 4 / Imagen 4 Fast
- Flux Dev (with LoRA support)
- Flux Kontext Pro (with image input)
- Phoenix 1.0 (Leonardo AI)
- Ideogram V3 Turbo
- Seedream-3 (ByteDance)

## Development

### Commands

```bash
# Development
pnpm dev          # Start dev server with Turbopack
pnpm build        # Build for production
pnpm start        # Start production server
pnpm lint         # Run linter

# Testing
pnpm test         # Run tests
pnpm test:watch   # Run tests in watch mode
pnpm test:coverage # Generate coverage report

# Storybook
pnpm storybook    # Start Storybook dev server
pnpm build-storybook # Build static Storybook
```

### Project Structure

```
src/
├── actions/        # Server actions for AI operations
├── app/           # Next.js app router pages
├── components/    # Reusable UI components
├── constants/     # App constants and configurations
├── hooks/         # Custom React hooks
├── lib/           # Utility functions and services
├── nodes/         # React Flow node components
├── schema/        # Zod schemas for data validation
├── services/      # Business logic services
├── stores/        # Zustand state management
└── types/         # TypeScript type definitions
```

### Tech Stack

- **Framework:** Next.js 15 with App Router
- **Language:** TypeScript
- **UI:** React 19, React Flow, Tailwind CSS 4
- **State:** Zustand
- **AI:** AI SDK (Vercel), OpenAI, Replicate
- **Components:** Radix UI
- **Testing:** Jest, React Testing Library
- **Dev Tools:** Storybook, ESLint, Prettier

## Architecture

### State Management

The app uses Zustand stores for state management:

- `flowStore` - React Flow nodes and edges
- `modelStore` - Selected AI models
- `imageStore` - Generated images
- `promptStore` - Prompt data and operations

### AI Integration

Server actions handle AI operations:

- Prompt enhancement using language models
- Image generation through multiple providers
- Prompt atomization and segmentation
- Image description and analysis

### Memory Management

Automatic cleanup system prevents memory issues:

- Old nodes and images are pruned periodically
- Aggressive cleanup mode for high memory usage
- Configurable limits for nodes, images, and prompts

## License

MIT - See [LICENSE](LICENSE) file for details
