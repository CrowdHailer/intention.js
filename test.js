function test () {
  (function () {
    var action = HTTPAction.success('my response')
    action.run().then(function (x) {
      console.info(x === 'my response', 'passed unit test')
    })
  }());

  (function () {
    var action = HTTPAction.success('my response').map(function (x) {
      return x.toUpperCase()
    })
    action.run().then(function (x) {
      console.info(x === 'MY RESPONSE', 'maps the return value')
    })
  }());

  (function () {
    var action = HTTPAction.success('my response').then(function (x) {
      return x.toUpperCase()
    })
    action.run().then(function (x) {
      console.info(x === 'MY RESPONSE', 'then works like map')
    })
  }());

  (function () {
    var action = HTTPAction.success('my response').flatMap(function (x) {
      return HTTPAction.success(x + x)
    })
    action.run().then(function (x) {
      console.info(x === 'my response' + 'my response', 'flatMap to a new action')
    })
  }());

  (function () {
    var action = HTTPAction.success('my response').then(function (x) {
      return HTTPAction.success(x + x)
    })
    action.run().then(function (x) {
      console.info(x === 'my response' + 'my response', 'then works like flatMap')
    })
  }());

  (function () {
    var action = HTTPAction.failure('Some reason')
    action.run().catch(function (err) {
      console.info(err === 'Some reason', 'create a failed Action')
    })
  }());
}
