#!/usr/bin/env node

const fs = require('fs/promises');
const path = require('path');
const { JSDOM } = require('jsdom');

// Configuration
const CONFIG = {
  srcDir: 'svg',
  distDir: '.',
  sizes: ['12' ,'16', '24', '20', '28', '32', '48'], // supported icon sizes
};

async function main() {
  try {
    // Ensure source and dist directories exist
    await createDirectories();

    // Get all SVG files from the source directory
    const files = await fs.readdir(CONFIG.srcDir);
    const svgFiles = files.filter(file => file.endsWith('.svg'));

    for (const svgFile of svgFiles) {
      await processIcon(svgFile);
    }

    console.log('Icon generation completed successfully!');
  } catch (error) {
    console.error('Error during icon generation:', error);
    process.exit(1);
  }
}

async function createDirectories() {
  // Create base directories if they don't exist
  await fs.mkdir(CONFIG.srcDir, { recursive: true });
  await fs.mkdir(CONFIG.distDir, { recursive: true });

  // Create size-specific directories
  for (const size of CONFIG.sizes) {
    await fs.mkdir(path.join(CONFIG.srcDir, size), { recursive: true });
    await fs.mkdir(path.join(CONFIG.distDir, size), { recursive: true });
  }
}

async function processIcon(svgFile) {
  // Extract size and name from filename (e.g., "example_24.svg" → size: "24", name: "example")
  const match = svgFile.match(/(.+)_(\d+)\.svg$/);
  if (!match) {
    console.warn(`Skipping ${svgFile}: filename doesn't match pattern name_size.svg`);
    return;
  }

  const [, name, size] = match;
  if (!CONFIG.sizes.includes(size)) {
    console.warn(`Skipping ${svgFile}: size ${size} is not supported`);
    return;
  }

  // Read SVG content
  const svgContent = await fs.readFile(path.join(CONFIG.srcDir, svgFile), 'utf-8');
  const { document } = new JSDOM(svgContent).window;
  const svgElement = document.querySelector('svg');

  if (!svgElement) {
    console.warn(`Skipping ${svgFile}: invalid SVG file`);
    return;
  }

  // Get SVG attributes
  const svgAttrs = {
    width: svgElement.getAttribute('width') || size,
    height: svgElement.getAttribute('height') || size,
    viewBox: svgElement.getAttribute('viewBox') || `0 0 ${size} ${size}`,
  };

  // Generate component name
  const componentName = `Icon${size}${capitalizeFirstLetter(name)}`;

  // Generate files
  await generateTypeScriptFile(name, size, componentName);
  await generateJavaScriptFile(name, size, componentName, svgElement, svgAttrs);
  await generateTypeDefinitionFile(name, size, componentName);
  await generateSourceMaps(name, size, componentName);

  // Move SVG to appropriate directory
  const targetPath = path.join(CONFIG.srcDir, size, `${name}.svg`);
  await fs.rename(path.join(CONFIG.srcDir, svgFile), targetPath);

  console.log(`Processed icon: ${svgFile}`);
}

async function generateTypeScriptFile(name, size, componentName) {
  const tsContent = `import { Icon } from '@telegram-apps/telegram-ui/dist/types/Icon';

export const ${componentName} = ({ ...restProps }: Icon) => (
  <svg width="${size}" height="${size}" fill="none" xmlns="http://www.w3.org/2000/svg" {...restProps}>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M4.3 7.54a1 1 0 0 1 1.4 0l6.8 6.8 6.8-6.8a1 1 0 1 1 1.4 1.42l-7.5 7.5a1 1 0 0 1-1.4 0l-7.5-7.5a1 1 0 0 1 0-1.42Z"
      fill="currentColor"
    />
  </svg>
);
`;

  await fs.writeFile(
    path.join(CONFIG.srcDir, size, `${name}.tsx`),
    tsContent
  );
}

async function generateJavaScriptFile(name, size, componentName, svgElement, svgAttrs) {
  const jsContent = `import { _ as _extends } from "@swc/helpers/_/_extends";
import { _ as _object_destructuring_empty } from "@swc/helpers/_/_object_destructuring_empty";
import { _ as _object_spread } from "@swc/helpers/_/_object_spread";
import { _ as _object_spread_props } from "@swc/helpers/_/_object_spread_props";
import { jsx as _jsx } from "react/jsx-runtime";

export const ${componentName} = (_param) => {
  var restProps = _extends({}, _object_destructuring_empty(_param));
  return /*#__PURE__*/ _jsx("svg", _object_spread_props(_object_spread({
    width: "${svgAttrs.width}",
    height: "${svgAttrs.height}",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg"
  }, restProps), {
    children: /*#__PURE__*/ _jsx("path", {
      fillRule: "evenodd",
      clipRule: "evenodd",
      d: "${svgElement.querySelector('path')?.getAttribute('d')}",
      fill: "currentColor"
    })
  }));
};

//# sourceMappingURL=${name}.js.map`;

  await fs.writeFile(
    path.join(CONFIG.distDir, size, `${name}.js`),
    jsContent
  );
}

async function generateTypeDefinitionFile(name, size, componentName) {
  const dtsContent = `/// <reference types="react" />
import { Icon } from '@telegram-apps/telegram-ui/dist/types/Icon';
export declare const ${componentName}: ({ ...restProps }: Icon) => JSX.Element;
//# sourceMappingURL=${name}.d.ts.map`;

  await fs.writeFile(
    path.join(CONFIG.distDir, size, `${name}.d.ts`),
    dtsContent
  );
}

async function generateSourceMaps(name, size, componentName) {
  // Generate .js.map
  const jsMapContent = {
    version: 3,
    sources: [`../../../src/icons/${size}/${name}.tsx`],
    names: [componentName, 'restProps', 'svg', 'width', 'height', 'fill', 'xmlns', 'path', 'fillRule', 'clipRule', 'd'],
    mappings: ';;;;;AAEA,OAAO,MAAMA,oBAAoB;QAAMC;yBACrC,KAACC;QAAIC,OAAM;QAAKC,QAAO;QAAKC,MAAK;QAAOC,OAAM;OAAiCL;kBAC7E,cAAA,KAACM;YAAKC,UAAS;YAAUC,UAAS;YAChCC,GAAE;YACFL,MAAK;;;EAET',
    sourcesContent: [
      `import { Icon } from '@telegram-apps/telegram-ui/dist/types/Icon';\n\nexport const ${componentName} = ({ ...restProps }: Icon) => (\n  <svg width="${size}" height="${size}" fill="none" xmlns="http://www.w3.org/2000/svg" {...restProps}>\n    <path\n      fillRule="evenodd"\n      clipRule="evenodd"\n      d="M4.3 7.54a1 1 0 0 1 1.4 0l6.8 6.8 6.8-6.8a1 1 0 1 1 1.4 1.42l-7.5 7.5a1 1 0 0 1-1.4 0l-7.5-7.5a1 1 0 0 1 0-1.42Z"\n      fill="currentColor"\n    />\n  </svg>\n);\n`
    ]
  };

  // Generate .d.ts.map
  const dtsMapContent = {
    version: 3,
    file: `${name}.d.ts`,
    sourceRoot: '',
    sources: [`../../../src/icons/${size}/${name}.tsx`],
    names: [],
    mappings: ';AAAA,OAAO,EAAE,IAAI,EAAE,MAAM,YAAY,CAAC;AAElC,eAAO,MAAM,iBAAiB,qBAAsB,IAAI,gBAMvD,CAAC'
  };

  await fs.writeFile(
    path.join(CONFIG.distDir, size, `${name}.js.map`),
    JSON.stringify(jsMapContent, null, 2)
  );

  await fs.writeFile(
    path.join(CONFIG.distDir, size, `${name}.d.ts.map`),
    JSON.stringify(dtsMapContent, null, 2)
  );
}

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

// Run the script
main();
