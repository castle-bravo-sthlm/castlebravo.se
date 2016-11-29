import babel from 'rollup-plugin-babel';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import replace from 'rollup-plugin-replace';
import uglify from 'rollup-plugin-uglify';

const dev = (process.env.NODE_ENV == 'dev');
export default {
  entry: 'src/client/index.js',
  format: 'iife',
  moduleName: 'CB',
  dest: 'dist/www/bundle.js',
  sourceMap: false,
  plugins: [
    resolve({
      jsnext: true,
      main: true,
      browser: true,
    }),
    commonjs(),
    babel({
      babelrc: false,
      exclude: 'node_modules/**',
      presets: [ [ 'es2015', { modules: false } ] ],
      plugins: [
        'external-helpers',
        'transform-object-rest-spread',
        ['transform-react-jsx', {
          'pragma': 'dom'
        }]
      ]
    }),
    replace({
      exclude: 'node_modules/**',
      ENV: JSON.stringify(process.env.NODE_ENV),
    }),
    uglify(),
  ]
};
