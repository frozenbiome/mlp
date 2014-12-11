angular.module('voto.services', [])

/**
 * A simple example service that returns some data.
 */

.factory('Main', function($location, $http) {
  // Some fake testing data
  var getAllGames = function() {
    return $http.get("http://10.8.16.232:8000/api/prompt");
  }

  //var games = [{
    //prompt: 'Dogs',
    //creator: 'Scruff McGruff',
    //id: 1
  //}, {
    //prompt: 'War',
    //creator: 'G.I. Joe',
    //id: 2
  //}, {
    //prompt: 'Hair',
    //creator: 'Miss Frizzle',
    //id: 3
  //}, {
    //prompt: 'Pokemon',
    //creator: 'Ash Ketchum',
    //id: 4
  //}];

  return {
    getAllGames: getAllGames,
    all: function() {
      return games;
    }
  }
})

.factory('Create', function($location) {
  // Some fake testing data
  var games = [{
    prompt: 'Dogs',
    creator: 'Scruff McGruff'
  }, {
    prompt: 'War',
    creator: 'G.I. Joe'
  }, {
    prompt: 'Hair',
    creator: 'Miss Frizzle'
  }, {
    prompt: 'Pokemon',
    creator: 'Ash Ketchum'
  }];

  return {
    all: function() {
      return games;
    }
  }

  // get: function(friendId) {
  //   // Simple index lookup
  //   return friends[friendId];
  // }
});
