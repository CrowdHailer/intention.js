// Monad laws
// https://curiosity-driven.org/monads-in-javascript
// 1. bind(unit(x), f) ≡ f(x)
//    => Intention.unit(x).flatMap(fn) = fn(x)
//    x: A
//    fn: A -> M[B]

// 2. bind(m, unit) ≡ m
//    => action.bind(unit) = action

// 3. bind(bind(m, f), g) ≡ bind(m, x ⇒ bind(f(x), g))
//    => action.bind(f).bind(g) = action.bind(x => f(x).bind(g))

// Promises
// The then method is a combination of flatMap and map

// Intention.success(x) = Intention.unit(new Promise(x))
function Intention (effectFn) {

  function map (mappingFunction) {
    return new Intention(function (io) {
      return effectFn(io).then(mappingFunction)
    })
  }

  function flatMap (transformFunction) {
    return new Intention (function (io) {
      return effectFn(io).then(function(x) {
        return transformFunction(x).run(io)
      })
    })
  }

  function then (continuation) {
    return new Intention (function (io) {
      return effectFn(io).then(function (x) {
        const mappedValue = continuation(x)
        if (mappedValue instanceof Intention) {
          return mappedValue.run(io)
        } else {
          return mappedValue
        }
      })
    })
  }

  Object.assign(this, {
    run: effectFn,
    map: map,
    flatMap: flatMap,
    then: then
  })
}

Intention.success = function (value) {
  return new Intention(function () {
    return Promise.resolve(value)
  })
}

Intention.failure = function (reason) {
  return new Intention(function () {
    return Promise.reject(reason)
  })
}

// TODO untested
Intention.fetch = function (path, opts) {
  return new Intention(function (io) {
    return io.fetch(path, opts)
  })
}
