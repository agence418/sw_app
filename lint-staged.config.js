export default {
  // TypeScript/JavaScript
  '*.{js,jsx,ts,tsx}': [
    'eslint --fix',
    'prettier --write'
  ],

  // Styles
  '*.{css,scss,sass}': [
    'prettier --write'
  ],

  // Markdown, JSON, YAML
  '*.{md,json,yaml,yml}': [
    'prettier --write'
  ],

  // Types TypeScript
  '*.{ts,tsx}': [
    () => 'tsc --noEmit'
  ]
}
