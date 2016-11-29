import { dom } from './packages/dom';
import App from './components/App'

if (ENV == 'dev') {
  // Enable LiveReload
  document.write(
    '<script src="http://' + (location.host || 'localhost').split(':')[0] +
    ':35729/livereload.js?snipver=1"></' + 'script>'
  );
}

document.body.appendChild(<App/>);
