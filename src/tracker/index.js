
/*

States:

*/
export let activeComputations = 0;

export let active = false;

export class Computation {

  constructor(fn, initalValue) {
    this._fn = fn;
    this._prevValue = initalValue;
    this._invalidationListeners = [];
    this._stopListeners = [];
    this.invalidated = false;
    this.stopped = false;
    _stats.computations++;
    activeComputations++;
    if(fn)
      this._run();
  }

  oninvalidate(callb) {
    if(this.invalidated) {
      callb()
    } else {
      _stats.callbacks++;
      this._invalidationListeners.push(callb);
    }
  }

  invalidate() {
    if(this.invalidated)
      return;
    _stats.invalidated++;
    this.invalidated = true;
    for(let callb of this._invalidationListeners) {
      _stats.callbacks++;
      callb();
    }
    this._invalidationListeners.length = 0;
    if(!this.stopped) {
      _invalidatedComputations.push(this);
      if(_invalidatedComputations.length == 1)
        requestAnimationFrame(flush)
    }

  }

  onstop(callb) {
    if(this.stopped)
      callb();
    else
      this._stopListeners.push(callb);
  }

  stop() {
    if(this.stopped)
      return;
    activeComputations--;
    this.stopped = true;
    this.invalidate();
    for(let callb of this._stopListeners) {
      _stats.callbacks++;
      callb();
    }
    this._stopListeners.length = 0;
  }

  _run() {
    if(this.stopped)
      return;
    _stats.runs++;
    this.invalidated = false;
    const prevComputation = _currentComputation;
    if(prevComputation)
      prevComputation.oninvalidate(_ => this.stop());
    _currentComputation = this;
    active = true;
    try {
      this._prevValue = this._fn.call(null, this._prevValue);
    }
    finally {
      _currentComputation = prevComputation;
      active = !!prevComputation;
    }
  }

  static get current() {
    // if(_nextComputation === _currentComputation) {
    //   _nextComputation = new Computation();
    // }
    return _currentComputation;
  }
}

// let _nextComputation = new Computation();
let _currentComputation = null;
const _invalidatedComputations = [];


export function autorun(fn, initialValue) {
  return new Computation(fn, initialValue);
}

export function nonreactive(fn, ...args) {
  const prevComputation = _currentComputation;
  _currentComputation = null;
  active = false;
  try {
    return fn.apply(this, args);
  }
  finally {
    _currentComputation = prevComputation;
    active = !!prevComputation;
  }
}

let _stats = null;
export function flush() {
  if(_currentComputation)
    throw new Error("Can't flush inside autorun");

  while(_invalidatedComputations.length) {
    _invalidatedComputations.shift()._run();
  }
  let stats = _stats;
  _stats = {
    computations: 0,
    invalidated: 0,
    callbacks: 0,
    runs: 0
  }
  return stats;
}
flush();


export class Dependency {

  constructor() {
    this._comps = new Set();
  }

  depend() {
    const comp = Computation.current;
    if(comp && !comp.invalidated && !this._comps.has(comp)) {
      this._comps.add(comp);
      comp.oninvalidate( _ => this._comps.delete(comp))
    }
  }

  changed() {
    for(let comp of this._comps)
      comp.invalidate();
  }
}

export class ReactiveVar {

  constructor(initialValue, equalFn = (a,b) => a === b) {
    this._equalFn = equalFn;
    this._dep = new Dependency()
    this._value = initialValue;
  }

  get() {
    this._dep.depend();
    return this._value;
  }

  set(value) {
    if(!this._equalFn(this._value, value)) {
      this._dep.changed();
    }
    this._value = value;
  }

  get valueFn() {
    return this._bound || (this._bound = this.get.bind(this))
  }
}

export function reactive(target, prop, desc) {
  const key = Symbol('reactive ' + prop);

  if(desc.writable)
    return {
      enumerable: true,
      get() {
        if(!(key in this)) {
          this[key] = new ReactiveVar(desc.initializer())
        }
        return this[key].get();
      },
      set(value) {
        if(!(key in this)) {
          this[key] = new ReactiveVar(desc.initializer())
        }
        this[key].set(value);
        return true;
      }
    }
  if(desc.get && !desc.set)
    return {
      enumerable:true,
      get() {
        const current = _currentComputation;
        // console.log('get rereactive')
        if(!current)
          return desc.get.call(this);

        let ctx = this[key];
        if(!ctx) {
          this[key] = ctx = {
            value: new ReactiveVar(),
            comps: new Set
          }
        }

        if(!ctx.comp) {
          nonreactive(() => {
            // console.log('starting rereactive')
            ctx.comp = autorun(() => {
              // console.log('updating rereactive')
              ctx.value.set(desc.get.call(this))
            })
            // ctx.comp.onstop(() => console.log('stopping rereactive'))
          })
        }
        if(!ctx.comps.has(current)) {
          ctx.comps.add(current);
          current.onstop(() => {
            ctx.comps.delete(current);
            if(ctx.comps.size == 0) {
              ctx.comp.stop();
              ctx.comp = null;
            }
          })
        }

        return ctx.value.get();
      }
    }
}

export function unreactive(target, prop, desc) {
  if(typeof desc.value !== 'function')
    throw new Error('Only methods can be marked unreactive');
  const fn = desc.value;
  return {
    ...desc,
    value: function(...args) {
      const prevComputation = _currentComputation;
      _currentComputation = null;
      active = false;
      try {
        return fn.apply(this, args);
      }
      finally {
        _currentComputation = prevComputation;
        active = !!prevComputation;
      }
    }
  }
}
