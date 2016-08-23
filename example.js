const log = window.console.log.bind(window.console)

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
      return Intention.fetch(root + '/posts/' + id).then(parseJSON)
    }
  }
  const Users = {
    fetch: function (id) {
      return Intention.fetch(root + '/users/' + id).then(parseJSON)
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
  action.run(window).then(log)
  // action is reusable
  action.run(window).then(log)
}
