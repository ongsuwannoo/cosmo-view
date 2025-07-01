# Alias Configuration Guide

This document outlines the comprehensive alias system implemented across the Cosmo View monorepo for clean, maintainable imports.

## 🎯 Overview

The project now uses a sophisticated alias system that allows for:

-   **Clean imports** within packages using `@/` prefix
-   **Workspace imports** using `@cosmo-view/package-name`
-   **Component-level aliases** for better organization
-   **Consistent import patterns** across the entire monorepo

## 📦 Package-Level Aliases

### UI Package (`packages/ui`)

**File: `packages/ui/tsconfig.json`**

```json
{
    "paths": {
        "@/*": ["./src/*"],
        "@/components/*": ["./src/components/*"],
        "@/components/base/*": ["./src/components/base/*"],
        "@/components/composed/*": ["./src/components/composed/*"],
        "@/components/features/*": ["./src/components/features/*"],
        "@/components/pages/*": ["./src/components/pages/*"],
        "@/lib/*": ["./src/lib/*"],
        "@/styles/*": ["./src/styles/*"]
    }
}
```

**Usage Examples:**

```typescript
// Before (relative imports)
import { Button } from "../../base/button";
import { LoginForm } from "../../features/login-form";

// After (alias imports)
import { Button } from "@/components/base/button";
import { LoginForm } from "@/components/features/login-form";
```

### Web App (`apps/web`)

**File: `apps/web/tsconfig.json`**

```json
{
    "paths": {
        "@/*": ["./src/*"],
        "@/components/*": ["./src/components/*"],
        "@/pages/*": ["./src/pages/*"],
        "@/stores/*": ["./src/stores/*"]
    }
}
```

**Usage Examples:**

```typescript
// Local imports with aliases
import { Dashboard } from "@/pages/dashboard";
import { useAuthStore } from "@/stores/auth";

// Workspace imports
import { Button, Card, AuthPage } from "@cosmo-view/ui";
```

## 🔧 Build Tool Configuration

### Vite Configuration (Web App)

**File: `apps/web/vite.config.ts`**

```typescript
resolve: {
  alias: {
    '@': path.resolve(__dirname, './src'),
    '@/components': path.resolve(__dirname, './src/components'),
    '@/pages': path.resolve(__dirname, './src/pages'),
    '@/stores': path.resolve(__dirname, './src/stores'),
    '@cosmo-view/ui': path.resolve(__dirname, '../../packages/ui/dist/index.js'),
    '@cosmo-view/ui/styles': path.resolve(__dirname, '../../packages/ui/dist/styles.css'),
  },
}
```

### Storybook Configuration

**File: `packages/ui/.storybook/main.ts`**

```typescript
viteFinal: async (config) => {
    if (config.resolve) {
        config.resolve.alias = {
            ...config.resolve.alias,
            "@": path.resolve(__dirname, "../src"),
            "@/components": path.resolve(__dirname, "../src/components"),
            "@/components/base": path.resolve(__dirname, "../src/components/base"),
            "@/components/composed": path.resolve(__dirname, "../src/components/composed"),
            "@/components/features": path.resolve(__dirname, "../src/components/features"),
            "@/components/pages": path.resolve(__dirname, "../src/components/pages"),
            "@/lib": path.resolve(__dirname, "../src/lib"),
            "@/styles": path.resolve(__dirname, "../src/styles"),
        };
    }
    return config;
};
```

## 🏗️ Component Import Patterns

### Base Components

```typescript
// File: packages/ui/src/components/features/login-form/login-form.tsx
import { Button } from "@/components/base/button";
import { Input } from "@/components/base/input";
```

### Composed Components

```typescript
// File: packages/ui/src/components/features/login-form/login-form.tsx
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/composed/card";
```

### Feature Components

```typescript
// File: packages/ui/src/components/pages/auth-page/auth-page.tsx
import { LoginForm } from "@/components/features/login-form";
```

### Package Exports

```typescript
// File: packages/ui/src/index.ts
export * from "@/components/base/button";
export * from "@/components/base/input";
export * from "@/components/composed/card";
export * from "@/components/features/login-form";
export * from "@/components/pages/auth-page";
export { cn } from "@/lib/utils";
```

## 📖 Storybook Stories

```typescript
// File: packages/ui/src/components/base/button/button.stories.tsx
import { Button } from "@/components/base/button";

// File: packages/ui/src/components/features/login-form/login-form.stories.tsx
import { LoginForm } from "@/components/features/login-form";
```

## 🌐 Cross-Package Imports

### In Web App Components

```typescript
// File: apps/web/src/pages/dashboard.tsx
import { useAuthStore } from "@/stores/auth";
import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle } from "@cosmo-view/ui";

// File: apps/web/src/router.tsx
import { Dashboard } from "@/pages/dashboard";
import { useAuthStore } from "@/stores/auth";
import { AuthPage } from "@cosmo-view/ui";
```

## 🎨 Style Imports

### CSS Imports

```typescript
// File: apps/web/src/main.tsx
import "@cosmo-view/ui/styles"; // Import UI package styles
import "./globals.css"; // Import local styles
```

## 📁 Directory Structure Mapping

```
packages/ui/src/
├── components/
│   ├── base/         → @/components/base/*
│   ├── composed/     → @/components/composed/*
│   ├── features/     → @/components/features/*
│   └── pages/        → @/components/pages/*
├── lib/              → @/lib/*
└── styles/           → @/styles/*

apps/web/src/
├── components/       → @/components/*
├── pages/            → @/pages/*
├── stores/           → @/stores/*
└── ...
```

## ✨ Benefits

1. **Cleaner Imports**: No more `../../../../../../` relative path madness
2. **Better Refactoring**: Moving files doesn't break import paths
3. **Consistent Structure**: Same patterns across all packages
4. **IDE Support**: Better autocomplete and navigation
5. **Maintainability**: Easier to understand and modify imports
6. **Type Safety**: Full TypeScript support with path mapping

## 🚀 Development Workflow

1. **Component Development**: Use `@/components/*` aliases within UI package
2. **Cross-Package Usage**: Import from `@cosmo-view/ui` in web app
3. **Local Development**: Use `@/` for local package imports
4. **Storybook**: All aliases work seamlessly in Storybook environment

This alias system provides a robust, scalable foundation for component-driven development across the entire monorepo!
