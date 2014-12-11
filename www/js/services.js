angular.module('voto.services', [])

.factory('GamesFactory', function($location, $http) {

  //Get all games that a user has created or joined
  var getAllGamesForUser = function() {
    //Emulator CAN connect to this IP
    return $http.get("http://10.8.16.232:8000/api/prompt/foruser");
  };

  return {
    getAllGamesForUser: getAllGamesForUser,
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
