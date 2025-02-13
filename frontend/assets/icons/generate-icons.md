# Icon Generator

This script automates the process of generating React icon components from SVG files.

## Prerequisites

Make sure you have the following installed:
- Node.js
- `@swc/cli` and `@swc/core` for JavaScript compilation
- TypeScript

Install the required dependencies:

```bash
npm install --save-dev @swc/cli @swc/core typescript
```

## Usage

1. Place your SVG icon file in the `/src/icons` directory
2. Name your file following the pattern: `iconname_size.svg` (e.g., `example_24.svg`)
3. Run the script:

```bash
node generate-icons.js
```

## What it does

For each SVG file (e.g., `example_24.svg`), the script will:

1. Create a size-specific directory if it doesn't exist (e.g., `/src/icons/24/`)
2. Move the SVG file to the appropriate directory
3. Generate the following files:
   - `icon24example.tsx` - React component source
   - `icon24example.js` - Compiled JavaScript
   - `icon24example.d.ts` - TypeScript declarations
   - `icon24example.js.map` - JavaScript source map
   - `icon24example.d.ts.map` - TypeScript declarations source map

## File Structure

After running the script, your directory structure will look like this:

```
src/
  icons/
    24/
      example_24.svg
      icon24example.tsx
      icon24example.js
      icon24example.js.map
      icon24example.d.ts
      icon24example.d.ts.map
```

## Usage in Your App

After generating the files, you can import the icon component like this:

```typescript
import { Icon24Example } from '@your-package/icons/24/icon24example';
```

## Error Handling

- The script will validate the SVG filename format
- It will check if the SVG contains valid path data
- Any errors during the process will be logged to the console

## Notes

- Make sure your SVG files follow the naming convention: `name_size.svg`
- The script assumes your SVG icons are simple path-based icons
- The generated components will use `currentColor` for fill, allowing for color customization via CSS
