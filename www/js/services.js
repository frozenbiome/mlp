angular.module('voto.services', [])

.factory('GamesFactory', function($location, $http) {

  //Get all games not user-created or not yet submitted to
  var getAllGamesForUser = function(user) {
    //Emulator CAN connect to this IP
    console.log("USER IS", user)
    return $http({
      url: "http://10.8.16.232:8000/api/prompt/created",
      method: "GET", 
      params: {user_id: 1}
    })
  };

  //Get all games that a user has created or joined
  var getAllGames = function() {
    return $http.get("http://10.8.16.232:8000/api/prompt/all");
  };

  //Gets user info from server for a given username. Server creates if not
  //found.
  var getUserInfo = function(username) {
    return $http({
      url: "http://10.8.16.232:8000/api/prompt/user",
      method: "GET", 
      params: {user: username}
    }).then(function(res) {return res.data;});
  }

  var getAllPhotosForGame = function(gameID) {
    return $http({ 
      url: "http://10.8.16.232:8000/", //TODO: fill out proper get request for gameID
      method: "GET", 
      params: {game: gameID}
    }).then(function(res) {return res.data;});
  }

  var chooseWinner = function(photoID, gameID) {
    return $http({ 
      url: "http://10.8.16.232:8000/", //TODO: fill out proper post request for updating winner category in game model
      method: "POST", 
      params: {
        game: gameID,
        photo: photoID
      }
    }).then(function(res) {return res.data;});
  }

  return {
    getAllGamesForUser: getAllGamesForUser,
    getAllGames: getAllGames,
    getAllPhotosForGame: getAllPhotosForGame,
    getUserInfo: getUserInfo,
    chooseWinner: chooseWinner,
    all: function() {
      return games;
    }
  }
})

.factory('Create', function($location) {
  var createNewGame = function() {
    //$http.post data:{creator: '', prompt: ''}
  }
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
    createNewGame: createNewGame,
    all: function() {
      return games;
    }
  }

  // get: function(friendId) {
  //   // Simple index lookup
  //   return friends[friendId];
  // }
});
