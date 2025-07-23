module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
    jest: true,
  },
  extends: [
    'react-app',
    'react-app/jest',
    'prettier',
  ],
  plugins: [
    'prettier',
  ],
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 2021,
    sourceType: 'module',
  },
  rules: {
    // Prettier integration
    'prettier/prettier': 'error',
    
    // React specific rules
    'react/jsx-uses-react': 'off',
    'react/react-in-jsx-scope': 'off', // Not needed in React 17+
    'react/prop-types': 'off', // If you're using TypeScript, you might want this off
    
    // General JavaScript/ES6+ rules
    'no-console': 'warn',
    'no-debugger': 'warn',
    'no-unused-vars': 'warn',
    'prefer-const': 'error',
    'no-var': 'error',
    
    // Import rules
    'import/no-unresolved': 'off', // react-scripts handles this
    'import/order': [
      'warn',
      {
        groups: [
          'builtin',
          'external',
          'internal',
          'parent',
          'sibling',
          'index'
        ],
        'newlines-between': 'always',
      },
    ],
    
    // JSX rules
    'jsx-quotes': ['error', 'prefer-double'],
    
    // Redux specific
    'no-param-reassign': [
      'error',
      {
        props: true,
        ignorePropertyModificationsFor: ['state'], // Allow Redux Toolkit's Immer
      },
    ],
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
};
