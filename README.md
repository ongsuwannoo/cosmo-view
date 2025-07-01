# Cosmo View

A modern frontend monorepo project with **React 19** and Component-Driven Development architecture.

## Features

-   🧩 **Monorepo Structure**: Organized with pnpm workspaces
-   ⚛️ **React 19 + TypeScript**: Latest React with full TypeScript support
-   🎨 **Component-Driven Development**: Components organized by abstraction levels
-   📚 **Storybook**: Interactive component documentation and development
-   🎯 **Tailwind CSS + shadcn/ui**: Beautiful, customizable UI components
-   🚀 **Tanstack Router**: Type-safe routing
-   🐻 **Zustand**: Lightweight state management
-   🔍 **Zod**: Runtime type validation
-   🧹 **Biome.js**: Fast formatting and linting
-   🔗 **Alias System**: Clean imports with comprehensive path mapping

## Project Structure

```
cosmo-view/
├── apps/
│   └── web/                    # Main web application
├── packages/
│   ├── ui/                     # Component library
│   │   ├── src/components/
│   │   │   ├── base/           # Basic UI primitives
│   │   │   ├── composed/       # Composed components
│   │   │   ├── features/       # Feature-specific components
│   │   │   └── pages/          # Page-level components
│   │   └── .storybook/         # Storybook configuration
│   └── typescript-config/      # Shared TypeScript configuration
├── package.json                # Root package.json with workspace config
├── pnpm-workspace.yaml         # pnpm workspace configuration
└── biome.json                  # Biome configuration
```

## Getting Started

1. **Install dependencies:**

    ```bash
    pnpm install
    ```

2. **Start development servers:**

    ```bash
    # Start all development servers
    pnpm dev

    # Or start individually:
    pnpm --filter @cosmo-view/web dev    # Web app
    pnpm --filter @cosmo-view/ui dev     # UI package build watch
    pnpm storybook                       # Storybook
    ```

3. **Build for production:**
    ```bash
    pnpm build
    ```

## Available Scripts

-   `pnpm dev` - Start all development servers
-   `pnpm build` - Build all packages and apps
-   `pnpm lint` - Lint all code with Biome
-   `pnpm format` - Format all code with Biome
-   `pnpm typecheck` - Type check all packages
-   `pnpm storybook` - Start Storybook development server
-   `pnpm clean` - Clean all build artifacts

## Component Development

Components are organized by abstraction levels following Component-Driven Development principles:

-   **Base**: Fundamental UI primitives (Button, Input, etc.)
-   **Composed**: Components built from base components (Card, Form, etc.)
-   **Features**: Business logic components (LoginForm, UserProfile, etc.)
-   **Pages**: Full page layouts (AuthPage, Dashboard, etc.)

Each component level has its own Storybook stories for isolated development and testing.

## Technology Stack

-   **Framework**: React 18 with TypeScript
-   **Build Tool**: Vite
-   **Styling**: Tailwind CSS with CSS Variables
-   **UI Components**: shadcn/ui primitives
-   **State Management**: Zustand
-   **Routing**: Tanstack Router
-   **Validation**: Zod
-   **Documentation**: Storybook
-   **Code Quality**: Biome.js
-   **Package Manager**: pnpm with workspaces
