import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';

export default tseslint.config(
  {
    // Global ignores
    ignores: ['node_modules/', 'dist/'],
  },
  // Base ESLint recommended rules
  eslint.configs.recommended,
  // TypeScript rules
  ...tseslint.configs.recommended,
  // Prettier integration (must be last)
  eslintPluginPrettierRecommended,
  // Custom project rules
  {
    // Ignore the config file itself from type-aware linting
    ignores: ['eslint.config.js'],
    languageOptions: {
      parserOptions: {
        project: true, // Use tsconfig.json from the root
        tsconfigRootDir: import.meta.dirname, // Correctly set root directory for TS project parsing
      },
      globals: {
        node: true,
        es2022: true,
      },
    },
    rules: {
      // Example: Allow unused vars starting with _
      // '@typescript-eslint/no-unused-vars': [
      //   'warn',
      //   { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      // ],
      '@typescript-eslint/no-unused-vars': 'warn', // Kept the original simple 'warn' rule for now
      // 'prettier/prettier': 'error', // This is usually handled by eslintPluginPrettierRecommended now
    },
  },
);
