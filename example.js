const log = window.console.log.bind(console)

function example () {
  const root = 'http://jsonplaceholder.typicode.com';
  function parseJSON (response) {
    if (response.ok) {
      return response.json()
    } else {
      throw new Error(response.status)
    }
  }

  const Posts = {
    fetch: function (id) {
      return HTTPAction.request(root + '/posts/' + id).then(parseJSON)
    }
  }
  const Users = {
    fetch: function (id) {
      return HTTPAction.request(root + '/users/' + id).then(parseJSON)
    }
  }

  var action = Posts.fetch(1).then(function (post) {
    return Users.fetch(post.userId).then(function (user) {
      return Object.assign(post, {user: user})
    })
  })
  // var action = Posts.fetch(1)
  // .flatMap(function (post) {
  //   return Users.fetch(post.userId)
  // })

  console.log(action)
  action.run(window.fetch).then(log)
  // action is reusable
  action.run(window.fetch).then(log)
}
