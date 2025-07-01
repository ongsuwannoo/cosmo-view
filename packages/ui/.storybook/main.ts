import path from 'node:path';
import type { StorybookConfig } from '@storybook/react-vite';

const config: StorybookConfig = {
  stories: ['../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/addon-interactions',
  ],
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
  typescript: {
    check: false,
    reactDocgen: 'react-docgen-typescript',
    reactDocgenTypescriptOptions: {
      shouldExtractLiteralValuesFromEnum: true,
      propFilter: (prop) => (prop.parent ? !/node_modules/.test(prop.parent.fileName) : true),
    },
  },
  docs: {
    autodocs: 'tag',
  },
  viteFinal: async (config) => {
    if (config.resolve) {
      config.resolve.alias = {
        ...config.resolve.alias,
        '@': path.resolve(__dirname, '../src'),
        '@/components': path.resolve(__dirname, '../src/components'),
        '@/components/base': path.resolve(__dirname, '../src/components/base'),
        '@/components/composed': path.resolve(__dirname, '../src/components/composed'),
        '@/components/features': path.resolve(__dirname, '../src/components/features'),
        '@/components/pages': path.resolve(__dirname, '../src/components/pages'),
        '@/lib': path.resolve(__dirname, '../src/lib'),
        '@/styles': path.resolve(__dirname, '../src/styles'),
      };
    }
    return config;
  },
};

export default config;
