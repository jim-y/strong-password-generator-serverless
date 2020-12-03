import resolve from '@rollup/plugin-node-resolve';
import replace from 'rollup-plugin-replace';
import { terser } from 'rollup-plugin-terser';
import css from 'rollup-plugin-css-only';
import builtins from 'rollup-plugin-node-builtins';

// `npm run build` -> `production` is true
// `npm run dev` -> `production` is false
const production = !process.env.ROLLUP_WATCH;

export default {
	input: 'src/main.js',
	output: {
		file: 'public/bundle.js',
		format: 'iife',
		sourcemap: process.env.CONTEXT !== 'production'
	},
	plugins: [
		builtins(),
		replace({ 
      // If you would like DEV messages, specify 'development'
      // Otherwise use 'production'
      'process.env.NODE_ENV': JSON.stringify('production') 
		}),
		resolve(), // tells Rollup how to find date-fns in node_modules
		production && terser(), // minify, but only in production
		css({ output: 'bundle.css' })
	]
};
