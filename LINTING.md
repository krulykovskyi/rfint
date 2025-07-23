# ESLint & Prettier Setup

This project is configured with ESLint and Prettier for consistent code formatting and quality.

## 🚀 Available Scripts

- `npm run lint` - Check for linting errors
- `npm run lint:fix` - Automatically fix linting errors
- `npm run format` - Format all files with Prettier
- `npm run format:check` - Check if files are formatted correctly
- `npm run check` - Run both linting and format check

## 📋 Configuration Files

- `.eslintrc.js` - ESLint configuration
- `.prettierrc` - Prettier formatting rules
- `.prettierignore` - Files to ignore for formatting
- `.vscode/settings.json` - VS Code workspace settings

## ✨ Features

### ESLint Rules
- React best practices
- Import order enforcement
- Redux/Immer compatibility
- Modern JavaScript standards
- Accessibility hints

### Prettier Formatting
- Single quotes for JavaScript
- Double quotes for JSX
- 2-space indentation
- Semicolons included
- Trailing commas where valid

### VS Code Integration
- Format on save
- Auto-fix ESLint issues on save
- Consistent editor settings

## 🔧 Manual Usage

### Check and fix all issues:
```bash
npm run check
npm run lint:fix
npm run format
```

### Quick format single file:
```bash
npx prettier --write src/components/MyComponent.js
```

### Quick lint single file:
```bash
npx eslint src/components/MyComponent.js --fix
```

## 📝 Recommended VS Code Extensions

1. **ESLint** (`dbaeumer.vscode-eslint`)
2. **Prettier** (`esbenp.prettier-vscode`)

These extensions will provide real-time feedback and automatic formatting in your editor.

## 🎯 Best Practices

1. Run `npm run check` before committing
2. Set up your editor to format on save
3. Use `npm run lint:fix` to quickly resolve most issues
4. Keep your code organized with proper import ordering
5. Follow the established patterns for consistency

## 🛠️ Customization

To customize rules, edit:
- `.eslintrc.js` for linting rules
- `.prettierrc` for formatting preferences

Happy coding! 🎉
