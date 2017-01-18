
if(typeof Object.entries == 'undefined') {
  Object.entries = function entries(ob) {
    return Object.keys(ob).map(key => [key, ob[key]])
  }
}

const bole = require('bole');
const http = require('http');
const url = require('url');
const router = require('router');
const finalhandler = require('finalhandler');
const browserify = require('browserify');
const watchifyMiddleware = require('watchify-middleware');
const imaginary = require('imaginary-middleware').default;
const serveStatic = require('serve-static');
const compression = require('compression');
const duplexer = require('duplexer2');
const { Readable, Writable, Transform } = require('stream');
const PauseStream = require('pause-stream');
const jsonpath = require('jsonpath');
const Vimeo = require('vimeo').Vimeo;

const args = require('minimist')(process.argv.slice(2));

const DEV = String(process.env.NODE_ENV).toLowerCase() == 'dev';
const PORT = process.env.PORT || 8080;

const vimeo = new Vimeo('1d5d88fb4b84d316a9d7452caa4bced0f747f3c2','zOSzmTBeR3i0KvU5OHcVJWIsQw/zclazBL2hLO6mBmy7yuHdc2aPGH9ToQdBD92MZt2gv21x7P7OTDdi9wnfywHeXKQuADS5eGojMGZm+cvgWLWr2ro0vVWtKpA+6psn','f9c73ea421a02c2858f31e2b15e78b7b');

bole.output({
  stream: process.stdout,
  level: DEV ? 'debug' : 'info'
})
const log = bole('server');

const app = router();


//app.use(compression());
// express compatibility
app.use((req, res, next) => {
  res.send = function(content) {
    this.statusCode = 200;
    this.end(content);
  }
  next();
})

app.use(simpleHttpLogger);



app.get('/', function(req, res, next) {
  res.send(generateIndex({ogTitle: 'Crosby' }));
})

app.get('/case/:caseId/', function(req, res, next) {
  const caseId = req.params.caseId;
  const url = 'http://' + req.headers.host + req.url;
  if(~caseId.indexOf('.'))
    next();
  else{
    request(`http://localhost:${PORT}/case/${caseId}/case.json`)
      .then(caseBuffer => {
          const caseJSON = JSON.parse(caseBuffer.toString());
          res.send(generateIndex({ogTitle: caseJSON.title, ogUrl: url, ogDescription: caseJSON.summary, ogImage: url + caseJSON.hero + '?transform=resize&width=1200'}));
      })
      .catch(e => {
        return log.error(`error when requesting case.json for caseId: ${caseId}, err: ${e}`);
      })
  }

})


app.get('/case/:caseId/case.json', cache({ttl:60*60}), function(req, res, next) {
  const query = url.parse(req.url, true).query;
  if(!('novideo' in query)) {
    req.headers['cache-control'] = 'no-cache';
    interceptResponse(res, res => {
      if(res.statusCode == 200) {
        res.removeHeader('content-length');
        return jsonTransform(obj => {
          jsonpath.query(obj, '$.content[?(@.type=="imageblock")]').forEach(blk => blk.images = blk.images.map(transformImage));

          function transformImage(image) {
            if(Array.isArray(image))
              return image.map(transformImage);

            if(typeof image == 'string') {
              const parts = url.parse(image, true);
              image = parts.query;
              for(let [key, value] of Object.entries(image))
                if(value === '')
                  image[key] = true;
              if(parts.pathname)
                image.src = parts.pathname;
            }

            if(image.vid) {
              image.vid = fetchVideoLinks(image.vid).catch(err => log.warn(err))
            }
            return image;
          }

          return obj;
        })
      }
    })
  }
  next();
})

const hasha = require('hasha');
const tee = require('tee');
const blobStore = require('atomic-fs-blob-store')('blobs');

function cache({ttl = 60} = {}) {
  return (req, res, next) => {
    const key = hasha(req.url, { algorithm: 'sha1' });

    blobStore.exists(key, (err, exists) => {
      if(exists) {
        blobStore.createReadStream(key)
          .pipe(metaStream(({statusCode, headers, time}, rest) => {
            const age = (Date.now() - time)/1000;
            if(age < ttl) {
              res.writeHead(statusCode, headers);
              rest.pipe(res);
            } else
              updateCache();
          }))
      } else {
        updateCache();
      }
    })

    function updateCache() {
      log.debug('updating cache', req.url);
      interceptResponse(res, ({statusCode, _headers}) => {
        const blobStream = metaStream({
          statusCode,
          headers:_headers,
          time: Date.now()
        })
        blobStream.pipe(blobStore.createWriteStream(key));
        return tee(blobStream);
      })
      next();
    }

  }

}

// app.get('/video.test', (req, res, next) => {
//   res.send('hej')
// })
//
// app.get('/video/:id', cache({ttl:60*60}), (req, res, next) => {
//   fetchVideoLinks(req.params.id).then(links => {
//     res.send(JSON.stringify(links))
//   })
// })

function fetchVideoLinks(id) {
  return new Promise((res,rej) => {
    vimeo.request({
      method:'GET',
      path:'/me/videos/'+id,
    }, (err, info) => err ? rej(err) : res(info))
  })
  .then(info => {
    const imgId = info.pictures.uri.split('/').pop();
    return info.files
    .filter(file => file.quality != 'hls')
    .map(({width, height, link}) => ({width, height, src:link, poster: `https://i.vimeocdn.com/video/${imgId}_${width}x${height}.jpg?r=pad`}))
  });
}

function flatEach(ar, callb) {
  ar.forEach(value => {
    if(Array.isArray(value))
      flatEach(value, callb);
    else
      callb(value);
  })
}

app.get('/content.json', cache(), function(req, res, next) {
  req.url = '/case/content.json';
  req.headers['cache-control'] = 'no-cache';
  interceptResponse(res, res => {
    //console.log('intercept /content.json', res.statusCode)
    if(res.statusCode == 200) {
      res.removeHeader('content-length');
      return jsonTransform(obj => {

        return caseSummary(obj.cases)
        .then(cases => {
          obj.cases = cases;
          return obj;
        })
        .catch(e => {
          log.warn(e);
        })
      })
    }
  })
  next();

  function caseSummary(value) {
    let overrides;
    if(typeof value == 'object') {
      if(Array.isArray(value))
        return Promise.all(value.map(caseSummary)).then(cases => cases.filter(Boolean));
      overrides = value;
    }
    else if(typeof value == 'string') {
      overrides = { id: value }
    }
    return request(`http://localhost:${PORT}/case/${overrides.id}/case.json?novideo`)
      .then(caseData => {
        return Object.assign(pick(JSON.parse(caseData.toString()), ['client', 'hero', 'title', 'summary']), overrides);
      })
      .catch(e => {
        return overrides.force ? overrides : undefined;
      })
  }
})


if(DEV) {
  const bundler = browserify('index.js', {
    cache: {},
    packageCache: {},
  })
  app.get('/bundle.js', watchifyMiddleware(bundler))
}

app.use(imaginary({
  serverUrl: 'http://imaginary.cluster.c2.se',
  sourceRoot: './public',
  cacheRoot: '/tmp/imaginary'
}));

app.use(serveStatic('public'));

if(args.proxy) {
  log.info('Proxying to:', args.proxy);
  app.use(proxy({target: args.proxy }))
}

const server = http.createServer((req, res) => {
  app(req, res, finalhandler(req,res));
})

server.listen(PORT);

function pick(ob, keys) {
  const ret = {};
  for(key of keys)
    if(key in ob)
      ret[key] = ob[key];
  return ret;
}

function combine(writable, ...transforms) {
  const readable = transforms.reduce((s,n) => s.pipe(n) );
  return duplexer(writable, readable)
}

function jsonTransform(fn) {
  const writable = new Sink;
  const readable = new PauseStream
  writable
    .then(buffer => fn(JSON.parse(buffer.toString())))
    .then(deepResolve)
    .then(obj => readable.end(JSON.stringify(obj, null, '  ')))
    .catch(e => readable.emit('error', e));

  return duplexer(writable, readable);
}

function deepResolve(obj) {
  if(typeof obj != 'object')
    return Promise.resolve(obj);

  const pending = [];
  for(const [key, value] of Object.entries(obj)) {
    pending.push(
      deepResolve(value)
      .then(value => {
        obj[key] = value
      })
      .catch(err => {
        delete obj[key];
      })
    );
  }
  return Promise.all(pending).then(() => obj)
}

function request(opt) {
  const sink = new Sink();
  http.get(opt, res => {
    if(res.statusCode != 200) {
      sink.emit('error', `Request failed (${res.statusCode})`)
    } else {
      res.pipe(sink);
    }
  })
  return Promise.resolve(sink);
}

class Sink extends Writable {

  constructor() {
    super();
    this._buffers = [];
    this._promise = new Promise((res, rej) => {
      this.on('finish', () => res(this.buffer));
      this.on('error', rej);
    })
  }

  get buffer() {
    this._buffers = [Buffer.concat(this._buffers)];
    return this._buffers[0];
  }

  then(...args) {
    return this._promise.then(...args);
  }

  _write(chunk, enc, callb) {
    this._buffers.push(chunk);
    callb();
  }
}

function generateIndex({ ogTitle = '', ogUrl = '', ogDescription = '', ogImage = '' }) {
  return `
<!doctype html>
<html>
  <head>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta property="og:url" content=${JSON.stringify(ogUrl)}>
    <meta property="og:title" content=${JSON.stringify(ogTitle)}>
    <meta property="og:description" content=${JSON.stringify(ogDescription)}>
    <meta property="og:image" content=${JSON.stringify(ogImage)}>

    <link rel="apple-touch-icon" sizes="180x180" href="/favicons/apple-touch-icon.png">
    <link rel="icon" type="image/png" href="/favicons/favicon-32x32.png" sizes="32x32">
    <link rel="icon" type="image/png" href="/favicons/favicon-16x16.png" sizes="16x16">
    <link rel="manifest" href="/favicons/manifest.json">
    <link rel="mask-icon" href="/favicons/safari-pinned-tab.svg" color="#3f3f3f ">
    <meta name="theme-color" content="#bcd6c1 ">

    <title>Castle Bravo</title>
    <link type="text/css" rel="stylesheet" href="//fast.fonts.net/cssapi/3c9a48eb-44bb-48fd-a161-dffbfb189b99.css"/>
  </head>
  <body>
    <script src="/bundle.js"></script>
  </body>
</html>
`;
}


function interceptResponse(res, callb) {
  const incoming = new PauseStream();
  const outgoing = new PauseStream();

  const { write, end, writeHead } = res;
  let headWritten = false;

  res.writeHead = (statusCode, ...args) => {
    //console.log('res.writeHead', statusCode, args);
    if(headWritten)
      return writeHead.call(res, statusCode, ...args);
    headWritten = true;
    if(typeof args[0] == 'string')
      res.statusMessage = args.shift();
    if(typeof args[0] == 'object')
      for(let [key, value] of Object.entries(args.shift()))
        res.setHeader(key, value)

    let stream = incoming;
    const transform = callb(res);
    if(transform)
      stream = stream.pipe(transform);
    stream.pipe(outgoing);
  }
  res.write = (...args) => {
    //console.log('res.write', args);
    if(!headWritten)
      res.writeHead(res.statusCode);
    return incoming.write(...args);
  }
  res.end = (...args) => {
    //console.log('res.end', args);
    if(!headWritten)
      res.writeHead(res.statusCode);
    return incoming.end(...args);
  }
  //res.on('finish', () => console.log('res finish'))

  outgoing
  .on('end', end.bind(res))
  .on('data', write.bind(res))
  .on('error', e => {
    log.error('transform error', e);
    res.destroy();
  })

}


function proxy({target, discard = 404 }) {
  const discardFn = createDiscardFn(discard);
  const turl = url.parse(target);
  return (req, res, next) => {
    const surl = url.parse(req.url);
    const pheaders = Object.assign({}, req.headers);
    delete pheaders.host;
    //pheaders['Cache-Control'] = 'no-cache';
    const preq = {
      hostname: turl.hostname,
      path: turl.pathname + surl.href.slice(1),
      headers: pheaders
    };
    log.info('proxy', surl.href);
    req.pipe(http.request(preq, pres => {
      if(discardFn(pres)) {
        pres.destroy();
        next();
        log.debug('proxy', surl.href, 'discarded')
      } else {
        //console.log('proxy res', pres.headers)
        res.writeHead(pres.statusCode, pres.headers);
        pres.pipe(res);
        log.debug('proxy', surl.href, 'handled')
      }
    }))
    .on('error', e => {
      log.error('proxy err', e)
      next(e);
    })
  }

  function createDiscardFn(pat) {
    switch(typeof pat) {
      case 'function':
        return pat;
      case 'number':
        pat = [pat];
        break;
      case 'string':
        pat = pat.split(/\D+/).map(Number);
        break;
    }
    if(Array.isArray(pat))
      return res => ~pat.indexOf(res.statusCode);
    throw new Error('Unknown discard pattern: ' + pat)
  }
}

function metaStream(callbOrValue) {
  return typeof callbOrValue == 'function' ? reader(callbOrValue) : writer(callbOrValue);

  function writer(meta) {
    let metaWritten = false;
    return new Transform({
      transform(chunk, enc, done) {
        if(!metaWritten) {
          const json = typeof meta == 'undefined' ? '' : JSON.stringify(meta);
          this.push(json+'\n');
          metaWritten = true;
        }
        done(null, chunk);
      }
    })
  }
  function reader(callb) {
    let handler = find;
    let buffer = [];
    return new Transform({
      transform(chunk, enc, done) {
        handler.call(this, chunk, done);
      }
    })

    function find(chunk, done) {
      let [before, after] = split.call(chunk, '\n');
      buffer.push(before);
      if(after) {
        let json = Buffer.concat(buffer).toString() || undefined;
        callb(json && JSON.parse(json), this);
        handler = found;
        buffer = null;
      }
      done(null, after);
    }

    function found(chunk, done) {
      done(null, chunk);
    }

    function split(sep) {
      let i = this.indexOf(sep);
      return ~i ? [this.slice(0,i), this.slice(i+sep.length)] : [this];
    }
  }
}

function simpleHttpLogger (req, res, next) {
  if (!req.url) return next()

  var byteLength = 0
  var now = Date.now()
  // log.debug({
  //   method: (req.method || 'GET').toUpperCase(),
  //   url: req.url
  // })
  var onFinished = function () {
    var elapsed = Date.now() - now
    log.info({
      elapsed: elapsed,
      contentLength: byteLength,
      method: (req.method || 'GET').toUpperCase(),
      url: req.url,
      statusCode: res.statusCode,
      colors: {
        elapsed: elapsed > 1000 ? 'yellow' : 'dim'
      }
    })
  }

  var isAlreadyLogging = res._simpleHttpLogger
  res._simpleHttpLogger = true

  if (!isAlreadyLogging) {
    var write = res.write
    res.once('finish', onFinished)

    // catch content-length of payload
    res.write = function (payload) {
      if (payload) byteLength += payload.length
      res.write = write
      res.write.apply(res, arguments)
    }
  }

  next()
}
