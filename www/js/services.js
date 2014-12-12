angular.module('voto.services', [])

.factory('GamesFactory', function($location, $http) {

  //Get all games that user created 
  var getAllGamesForUser = function(user) {
    //Emulator CAN connect to this IP
    console.log("Getting Created By", user)
    return $http({
      url: "http://10.8.16.232:8000/api/prompt/created",
      method: "GET", 
      //Change this to pull from $rootScope
      params: {user_id: user.id}
    })
  };

  var getAllPlayingGames = function(user) {
    console.log("Getting played by", user)
    return $http({
      url: "http://10.8.16.232:8000/api/prompt/playing",
      method: "GET", 
      //Change this to pull from $rootScope
      params: {user_id: user.id}
    })
  };  

  //Get all games that a user has created or joined
  var getAllGames = function() {
    return $http.get("http://10.8.16.232:8000/api/prompt/all");
  };

  //Has photo attributes
  var getGameData = function (game_id) {
    return $http({
      url: "http://10.8.16.232:8000/api/prompt/" + game_id,
      method: "GET", 
    })
      .then(function (res) {
        return res.data;
      });
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
      url: "http://10.8.16.232:8000/api/prompt/winner", //TODO: fill out proper post request for updating winner category in game model
      method: "POST", 
      data: {
        photoID: photoID,
        gameID: gameID
      }
    }).then(function(res) {return res.data;});
  }

  return {
    getAllGamesForUser: getAllGamesForUser,
    getAllGames: getAllGames,
    getGameData: getGameData,
    getAllPhotosForGame: getAllPhotosForGame,
    getAllPlayingGames: getAllPlayingGames,
    getUserInfo: getUserInfo,
    chooseWinner: chooseWinner,
    all: function() {
      return games;
    }
  }
})

.factory('Create', function($location, $http) {
  var createNewGame = function(userID, prompt) {
    $http({
      url: "http://10.8.16.232:8000/api/prompt/",
      method: 'POST',
      data: {
        userId: userID, 
        title: prompt,
        // startTime: moment(),
        // endTime: moment().add(4, 'h'),
        // votingEndTime: moment().add(6, 'h'),
      }
    })
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

  var getAllPublicGames = function(user) {   
  console.log("USER ID IS", user)
    return $http({
      url: "http://10.8.16.232:8000/api/prompt/all",
      method: "GET", 
      // Change this to pull from $rootScope
      params: {user_id: user.id}
    })
  }

  return {
    createNewGame: createNewGame,
    getAllPublicGames: getAllPublicGames,
    all: function() {
      return games;
    }
  }

  // get: function(friendId) {
  //   // Simple index lookup
  //   return friends[friendId];
  // }
});
