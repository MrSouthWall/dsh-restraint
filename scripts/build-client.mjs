#!/usr/bin/env node
/**
 * Assembles modular src/client/*.js files into the single browser-ready client.js
 * conforming to DSH's window.__ModuleLoader__.load contract.
 */

import { readFileSync, writeFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import lunarPkg from 'lunar-javascript';
import { BAZI_TERM_GLOSSARY } from '../lib/data/tutorials.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');

const orderedFiles = [
  'src/client/locales.js',
  'src/client/styles.js',
  'src/client/choice-menu.js',
  'src/client/date-time-picker.js',
  'src/client/birth-fields.js',
  'src/client/birth-profiles.js',
  'src/client/visuals.js',
  'src/client/visuals-stage.js',
  'src/client/views-bazi.js',
  'src/client/views-qimen.js',
  'src/client/views-meihua.js',
  'src/client/views-ziwei.js',
  'src/client/views-hepan.js',
  'src/client/views-tutorial.js',
  'src/client/studio.js',
  'src/client/cards.js',
  'src/client/entry.js',
];

const sections = orderedFiles.map(rel => {
  const code = readFileSync(resolve(root, rel), 'utf8').trim();
  return `    // --- ${rel} ---\n` + code.split('\n').map(line => (line ? `    ${line}` : '')).join('\n');
});

// Use the same lunar month data as the host to validate profiles before casting.
const lunarMonthDays = Array.from({ length: 199 }, (_, index) => {
  const year = 1901 + index;
  const days = Object.fromEntries(lunarPkg.LunarYear.fromYear(year).getMonthsInYear()
    .map(month => [month.getMonth(), month.getDayCount()]));
  return `      ${year}: ${JSON.stringify(days)},`;
}).join('\n');

const output = `/**
 * Browser client module for @local/dsh-zhiming (虚白 · 风水玄学罗盘插件).
 * Generated from src/client/*.js via scripts/build-client.mjs.
 * Zero external runtime imports beyond browser-provided React.
 */
window.__ModuleLoader__.load({
  id: '@local/dsh-zhiming',
  factory(require) {
    const React = require('react');
    const BAZI_TERM_GLOSSARY = ${JSON.stringify(BAZI_TERM_GLOSSARY)};
    const LUNAR_MONTH_DAYS = {
${lunarMonthDays}
    };

${sections.join('\n\n')}

    return createPluginEntry(React);
  },
});
`;

writeFileSync(resolve(root, 'client.js'), output, 'utf8');
console.log(`Built client.js (${Buffer.byteLength(output, 'utf8')} bytes) from ${orderedFiles.length} modules.`);
