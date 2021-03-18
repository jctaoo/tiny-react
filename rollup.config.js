import path from 'path';
import pkg from './package.json';
import json from '@rollup/plugin-json';
import typescript from '@rollup/plugin-typescript';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';

const NAME = pkg.name;

const tsConfigPath = path.resolve(process.cwd(), "tsconfig.json");
const srcPath = path.resolve(process.cwd(), "src");
const inputFilePath = path.join(srcPath, "index.ts");
const distPath = path.resolve(process.cwd(), "dist");
const umdDistPath = path.join(distPath, "umd", `${NAME}.js`);
const esmDistPath = path.join(distPath, "esm", `${NAME}.js`);

// **************** Utils Start ****************
function camelize(str) {
  return str.replace(/(?:^\w|[A-Z]|\b\w)/g, function(word, index) {
    return index === 0 ? word.toLowerCase() : word.toUpperCase();
  }).replace(/\s+/g, '');
}
// **************** Utils End ****************

/** @type {import('rollup').RollupOptions} */
const config = {
  input: inputFilePath,
  output: [
    { file: umdDistPath, name: camelize(NAME), format: 'umd', sourcemap: true },
    { file: esmDistPath, format: 'esm', sourcemap: true },
  ],
  plugins: [
    json(),
    typescript({ tsconfig: tsConfigPath }),
    commonjs(),
    resolve(),
  ]
};

export default config;