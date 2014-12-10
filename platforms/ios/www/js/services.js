angular.module('voto.services', [])

/**
 * A simple example service that returns some data.
 */

.factory('Main', function($location) {
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
