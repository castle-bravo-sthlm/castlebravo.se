
import 'classlist-polyfill';

if(!('scrollingElement' in document))
  document.scrollingElement = document.body;

if(typeof Object.entries == 'undefined') {
  Object.entries = function entries(ob) {
    return Object.keys(ob).map(key => [key, ob[key]])
  }
}
