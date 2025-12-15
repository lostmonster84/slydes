// ESLint v9 flat config for the monorepo.
//
// Important: do NOT use legacy `.eslintrc.*` in ESLint v9 (it can crash with circular JSON errors).
// `eslint-config-next` now exports a flat-config array, so we can consume it directly.
import next from 'eslint-config-next'

export default [
  // Ignore generated / vendored output (flat-config does not automatically ignore `.next`)
  {
    ignores: [
      '**/.next/**',
      '**/node_modules/**',
      '**/dist/**',
      '**/*.tsbuildinfo',
      '**/*.backup.*',
    ],
  },
  ...next,
  // Repo-wide overrides:
  // - `react/no-unescaped-entities` is noisy for marketing copy / demo content.
  // - `react-hooks/set-state-in-effect` is a new rule that flags common patterns in our demo UI.
  //   We still rely on `react-hooks/exhaustive-deps` and runtime correctness checks.
  {
    rules: {
      'react/no-unescaped-entities': 'off',
      'react-hooks/set-state-in-effect': 'off',
    },
  },
]


