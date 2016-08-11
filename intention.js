// Monad laws
// https://curiosity-driven.org/monads-in-javascript
// 1. bind(unit(x), f) ≡ f(x)
//    => HTTPAction.unit(x).flatMap(fn) = fn(x)
//    x: A
//    fn: A -> M[B]

// 2. bind(m, unit) ≡ m
//    => action.bind(unit) = action

// 3. bind(bind(m, f), g) ≡ bind(m, x ⇒ bind(f(x), g))
//    => action.bind(f).bind(g) = action.bind(x => f(x).bind(g))

// Promises
// The then method is a combination of flatMap and map

// HTTPAction.success(x) = HTTPAction.unit(new Promise(x))
function HTTPAction (httpEffect) {

  function map (mappingFunction) {
    return new HTTPAction(function (fetch) {
      return httpEffect(fetch).then(mappingFunction)
    })
  }

  function flatMap (transformFunction) {
    return new HTTPAction (function (fetch) {
      return httpEffect(fetch).then(function(x) {
        return transformFunction(x).run(fetch)
      })
    })
  }

  function then (continuation) {
    return new HTTPAction (function (fetch) {
      return httpEffect(fetch).then(function (x) {
        const mappedValue = continuation(x)
        if (mappedValue instanceof HTTPAction) {
          return mappedValue.run(fetch)
        } else {
          return mappedValue
        }
      })
    })
  }

  Object.assign(this, {
    run: httpEffect,
    map: map,
    flatMap: flatMap,
    then: then
  })
}

HTTPAction.success = function (value) {
  return new HTTPAction(function () {
    return Promise.resolve(value)
  })
}

HTTPAction.failure = function (reason) {
  return new HTTPAction(function () {
    return Promise.reject(reason)
  })
}

// TODO untested
HTTPAction.request = function (path, opts) {
  return new HTTPAction(function (fetch) {
    return fetch(path, opts)
  })
}
