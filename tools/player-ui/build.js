import { build } from 'esbuild';
await build({ entryPoints: ['index.js'], bundle: true, minify: true, format: 'iife', target: ['es2022'], platform: 'browser', outfile: '../../public/vendor/player-ui.js', legalComments: 'external', loader: { '.woff': 'dataurl', '.woff2': 'dataurl', '.ttf': 'dataurl', '.eot': 'dataurl', '.svg': 'dataurl' } });
