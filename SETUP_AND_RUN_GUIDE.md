# 🚀 Cosmo View - Setup & Run Guide

Complete guide to set up and run the Cosmo View project with all its features including TanStack Query, Component Library, and Storybook.

## 📋 Prerequisites

Before starting, ensure you have the following installed:

-   **Node.js**: >= 18.0.0 (recommended: use LTS version)
-   **pnpm**: >= 8.0.0 (package manager)
-   **Git**: For version control

### Install pnpm (if not installed)

```bash
# Using npm
npm install -g pnpm

# Using Homebrew (macOS)
brew install pnpm

# Using Corepack (Node.js 16.10+)
corepack enable
```

## 🏗️ Project Setup

### 1. Clone and Install Dependencies

```bash
# Clone the repository
git clone <your-repo-url>
cd cosmo-view

# Install all dependencies for the monorepo
pnpm install
```

### 2. Environment Configuration

Create environment file for the web app:

```bash
# Copy environment example
cp apps/web/.env.example apps/web/.env

# Edit environment variables
# VITE_API_BASE_URL=http://localhost:3001/api
```

### 3. Build Dependencies

Build the UI package first (required for the web app):

```bash
# Build UI package
pnpm --filter @cosmo-view/ui build
```

## 🚀 Running the Project

### Development Mode

#### Option 1: Start Everything (Recommended)

```bash
# Start all development servers simultaneously
pnpm dev
```

This will start:

-   **Web App**: <http://localhost:5173>
-   **UI Package**: Build watcher for component changes

#### Option 2: Start Services Individually

```bash
# Terminal 1: UI Package (component library)
pnpm --filter @cosmo-view/ui dev

# Terminal 2: Web App
pnpm --filter @cosmo-view/web dev

# Terminal 3: Storybook (optional)
pnpm storybook
```

### Storybook Development

```bash
# Start Storybook component explorer
pnpm storybook
# Opens: http://localhost:6006
```

### Production Build

```bash
# Build all packages and applications
pnpm build

# Preview production build
pnpm --filter @cosmo-view/web preview
# Opens: http://localhost:4173
```

## 🌐 Application URLs

| Service       | URL                     | Description        |
| ------------- | ----------------------- | ------------------ |
| **Web App**   | <http://localhost:5173> | Main application   |
| **Storybook** | <http://localhost:6006> | Component library  |
| **Preview**   | <http://localhost:4173> | Production preview |

## 📦 Available Scripts

### Root Level Commands

```bash
# Development
pnpm dev              # Start all development servers
pnpm build            # Build all packages and apps
pnpm clean            # Clean all build artifacts

# Code Quality
pnpm lint             # Lint all code with Biome
pnpm format           # Format all code with Biome
pnpm check            # Run Biome checks
pnpm typecheck        # Type check all packages

# Component Development
pnpm storybook        # Start Storybook
pnpm build-storybook  # Build Storybook for deployment
```

### Package-Specific Commands

```bash
# Web App (@cosmo-view/web)
pnpm --filter @cosmo-view/web dev
pnpm --filter @cosmo-view/web build
pnpm --filter @cosmo-view/web preview
pnpm --filter @cosmo-view/web typecheck

# UI Package (@cosmo-view/ui)
pnpm --filter @cosmo-view/ui dev
pnpm --filter @cosmo-view/ui build
pnpm --filter @cosmo-view/ui storybook
```

## 🔧 Development Workflow

### 1. Component Development

1. **Create Component**: Add to `packages/ui/src/components/`
2. **Add Story**: Create `.stories.tsx` file for Storybook
3. **Export**: Add to appropriate `index.ts` files
4. **Test**: View in Storybook at <http://localhost:6006>

### 2. Feature Development

1. **Start Dev Mode**: `pnpm dev`
2. **Edit Components**: Changes auto-reload
3. **Use TanStack Query**: Leverage built-in API hooks
4. **Check Types**: `pnpm typecheck`

### 3. API Integration

The project includes a complete TanStack Query setup:

```typescript
// Use pre-built hooks
import { useUsers, useCreateUser } from "@/lib/api/hooks";

function MyComponent() {
    const { data: users, isLoading } = useUsers();
    const createUserMutation = useCreateUser();

    // API calls are type-safe and include error handling
}
```

## 🛠️ Troubleshooting

### Common Issues

#### 1. Port Already in Use

```bash
# Find and kill process using the port
lsof -ti:5173 | xargs kill -9
```

#### 2. Build Errors

```bash
# Clean and rebuild
pnpm clean
pnpm install
pnpm --filter @cosmo-view/ui build
pnpm dev
```

#### 3. TypeScript Errors

```bash
# Check types across all packages
pnpm typecheck

# Check specific package
pnpm --filter @cosmo-view/web typecheck
```

#### 4. Dependency Issues

```bash
# Update lockfile
rm pnpm-lock.yaml
pnpm install

# Verify workspace setup
pnpm list --depth=0
```

### Development Tools

#### VS Code Extensions (Recommended)

-   **Biome**: Official Biome extension for formatting/linting
-   **TypeScript**: Enhanced TypeScript support
-   **Tailwind CSS IntelliSense**: CSS class autocomplete
-   **Auto Rename Tag**: HTML tag renaming

#### Browser Dev Tools

-   **React Developer Tools**: Debug React components
-   **TanStack Query DevTools**: Inspect queries and cache (auto-enabled in dev)

## 📁 Project Structure Reference

```
cosmo-view/
├── apps/
│   └── web/                    # Main React app
│       ├── src/
│       │   ├── lib/           # TanStack Query setup
│       │   ├── pages/         # Application pages
│       │   ├── stores/        # Zustand stores
│       │   └── components/    # App-specific components
│       ├── .env.example       # Environment template
│       └── package.json
├── packages/
│   ├── ui/                    # Component library
│   │   ├── src/components/   # Organized by abstraction
│   │   ├── .storybook/       # Storybook config
│   │   └── dist/             # Built components
│   └── typescript-config/    # Shared TS configs
├── package.json              # Root workspace config
├── pnpm-workspace.yaml       # Workspace definition
└── biome.json               # Code quality config
```

## 🎯 Next Steps

1. **Configure API**: Update `VITE_API_BASE_URL` in `.env`
2. **Add Components**: Develop new components using CDD approach
3. **Implement Features**: Use TanStack Query for data fetching
4. **Deploy**: Build and deploy to your hosting platform

## 📚 Additional Resources

-   [Component Development Guide](./packages/ui/README.md)
-   [TanStack Query Setup](./TANSTACK_QUERY_SETUP.md)
-   [Alias System Guide](./ALIAS_GUIDE.md)
-   [React 19 Upgrade Notes](./REACT_19_UPGRADE.md)

---

**Happy coding! 🎉**

For questions or issues, check the troubleshooting section or review the component documentation in Storybook.
