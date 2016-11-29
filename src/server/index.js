import http from 'http'
import cluster from 'cluster'
import finalhandler from 'finalhandler'
import router from 'router'
import serveStatic from 'serve-static'
import bole from 'bole'
import path from 'path'
import compression from 'compression';

import chokidar from 'chokidar'
import tinylr from 'tiny-lr'
import cpx from 'cpx'
import rollup from 'rollup'
import babel from 'rollup-plugin-babel'
import resolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'
import replace from 'rollup-plugin-replace'
import uglify from 'rollup-plugin-uglify'

const ENV = String(process.env.NODE_ENV).toLowerCase()
const DEV = ENV == 'dev'
const PORT = process.env.PORT || 8080
const __dirname = process.cwd()

bole.output({
  stream: process.stdout,
  level: DEV ? 'debug' : 'info'
})

const log = bole('server')

if (cluster.isMaster) {
  if (DEV) {
    cluster.on('exit', _ => cluster.fork())
    cluster.fork()
  } else {
    cluster.fork()
  }
} else {
  if (DEV) {
    const wwwRoot = 'dist/www/'
    // livereload
    const lrserver = tinylr()
    lrserver.listen(35729, () => log.info('LIVERELOAD: listening on 35729'))

    // restart server on change
    chokidar.watch('./src/server/**/*.*').on('change', e => {
      log.info(`CHOKIDAR: change in ${e}, restarting server`)
      process.exit()
    })

    // copy static resources on change
    const cpxw = cpx.watch(`${__dirname}/src/client/static/**/*`, `${__dirname}/dist/www`)

    cpxw.on('copy', (e) => {
      log.info(`CPX: copied ${e.srcPath} to ${e.dstPath}`)
      const file = path.relative(wwwRoot, e.dstPath)
      reloadBrowser(file)
    })

    cpxw.on('remove', (e) => {
      log.info(`CPX: removed ${e.path}`)
    })

    cpxw.on('watch-error', (err) => {
      log.error('CPX: error when watching static', err)
    })

    buildBundle()
    chokidar.watch('./src/client/**/*.{js,jsx}').on('change', e => {
      log.info(`CHOKIDAR: change in ${e}, rebuild bundle`)
      buildBundle()
    })

    function reloadBrowser(files) {
      try {
        lrserver.changed({
          body: {
            files: files
          }
        })
      } catch (e) {
        throw e
      }
    }

    var cache
    function buildBundle () {
      const start = process.hrtime()
      log.info(`ROLLUP: bundling`)
      rollup.rollup({
        entry: `${__dirname}/src/client/index.js`,
        cache: cache,
        plugins: [
          resolve({
            jsnext: true,
            main: true,
            browser: true
          }),
          commonjs(),
          babel({
            babelrc: false,
            exclude: ['node_modules/**'],
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
            ENV: JSON.stringify('dev'),
            'process.env.NODE_ENV': JSON.stringify('dev')
          })
        ]
      }).then((bundle) => {
        log.info(`ROLLUP: writing bundle`)
        cache = bundle
        bundle.write({
          format: 'iife',
          moduleName: 'CB',
          dest: `${__dirname}/dist/www/bundle.js`,
          sourceMap: 'inline'
        }).then(() => {
          let diff = process.hrtime(start)
          log.info(`ROLLUP: bundle created in ${diff[0]}.${diff[1]}s`)
          reloadBrowser('bundle.js')
        }).catch((err) => {
          log.error(`ROLLUP: bundle.write error: ${err}`)
        })
      }).catch((err) => {
        if(err instanceof RangeError) {
          log.error(`ROLLUP: RangeError (bug in rollup deepcopy) rebuilding bundle: ${err}`)
          cache = null;
          buildBundle();
        }else {
          log.error(`ROLLUP: ${err}`)
        }
      })
    }
  }

  const app = router()

  app.use(compression());
  app.use(serveStatic('dist/www', {
    'index': ['index.html']
  }))

  const server = http.createServer((req, res) => {
    app(req, res, finalhandler(req, res))
  })

  server.listen(PORT)
  log.info('HTTP: app listening on port 8080!')
}
