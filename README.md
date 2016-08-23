# Intention.js
**Pure implementation of the JavaScript fetch API exposing an analogue to the promise API.**

The global fetch function is an easier way to make web requests and handle responses than using an XMLHttpRequest.
Using intention.js gives you the same convenient API as well as managing side effects.

*N.B. if you want to support all browsers you will need a polyfill for fetch and possibly es6-promises*

---

This is an experimental project, it is similar to some of the below projects but I am pushing Intention.js to be mostly tied to the fetch API.

- [folktale / data.task](https://github.com/folktale/data.task)

## Usage

The fetch function supports any HTTP method. We'll focus on GET and POST example requests.

Optionally open the `sandbox.html` and run `example()` in the console.
All examples in sandbox call out to the [JSON placeholder api](https://jsonplaceholder.typicode.com/) so should work as described.

### Simple request

```js
var getPage = new Intention(function (fetch) {
  return fetch('/users.html').then(function (response) {
    return response.text()
  })
})

// No external call is made untill the action is run
getPage.run(window).then(function (body) {
  console.log(body)
})
```

## Using the request helper
*Creates the same getPage action*

```js
var getPage = Intention.fetch('/users.html').then(function (response) {
  return response.text
})
```

## Handling bad response status
Intentions have the same error semantics as promises so throwing an error in a then block will be correctly passed to the promise error handler when run

```js
function parseJSONResponse (response) {
  if (response.ok) {
    return response.json()
  } else {
    throw new Error(response.status)
  }
}

function getPost (id) {
  return Intention.fetch('/posts/' + id).then(parseJSON)
}

getPost(1)
  .run(window)
  .then(console.log.bind(console))
  .catch(console.error.bind(console))
```

## Chaining Requests
Again following the API of promises shows us how to chain API calls.

```js
function getUser (id) {
  return Intention.fetch('/users/' + id).then(parseJSON)
}

var getPostsUser = getPost
  .then(function (post) {
    return getUser(post.userId)
  })
```

## Composing Requests
If the final result needs information from several requests they can be composed rather than changed

```js
var getPostAndUserInfo = getPost(1).then(function (post) {
  return getUser(post.userId).then(function (user) {
    return Object.assign(post, {user: user})
  })
})
```

## Installation
At the moment intention.js is available as a script tag.

```html
<script src="path/to/intention.js"></script>
```

## References

- [monads in javascript](https://curiosity-driven.org/monads-in-javascript)
- [Async IO monad](https://gist.github.com/sharkbrainguy/9224895)
