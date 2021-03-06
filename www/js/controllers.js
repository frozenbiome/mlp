angular.module('voto.controllers', [])


.controller('MainCtrl', function($scope, $rootScope, GamesFactory, $ionicPopup) {
  //Auth.isAuth();
  //$scope.signOut = Auth.signOut;
  //$scope.limitChar = function (string, limit) {
  //return (string.length < limit) ? string : string.substr(0, limit) + "...";
  //};
  //

  $scope.saveGameToRootScope = function(game) {
    console.log("Saving game to scope: ", game)
    $rootScope.currentGame = game;
  }

  //Gets all games user created
  $scope.getAllGamesForUser = function() {
    if ($rootScope.user) {
      GamesFactory.getAllGamesForUser($rootScope.user)
        .then(function(res) {
          $scope.createdGames = res.data;
          console.log("Games User Created: ", res.data);
        });
    }
  }

  //Gets all games user submitted to
  $scope.getAllPlayingGames = function() {
    if ($rootScope.user) {
      GamesFactory.getAllPlayingGames($rootScope.user)
        .then(function(res) {
          console.log("PLAYING GAMES: ", res.data)
          $scope.playingGames = res.data;
        });
    }
  }

  $scope.loginPopup = function() {
    $scope.data = {}

    if (!$rootScope.user) {
      var myPopup = $ionicPopup.show({
        template: '<input type="text" ng-model="data.username">',
        title: 'Pick a Name',
        subTitle: 'any name...',
        scope: $scope,
        buttons: [{
          text: '<b>Save</b>',
          type: 'button-positive',
          onTap: function(e) {}
        }, ]
      });
      myPopup.then(function(res) {
        GamesFactory.getUserInfo($scope.data.username)
          .then(function(user) {
            $rootScope.user = user;
            $scope.getAllGamesForUser();
            $scope.getAllPlayingGames();
          })
      });
    }
  }();

})

.controller('CreateCtrl', function($scope, $rootScope, Create) {
  $scope.games = Create.all();

  $scope.saveGameToRootScope = function(game) {
    console.log("Saving game to scope: ", game)
    $rootScope.currentGame = game;
  }

  $scope.getAllPublicGames = function() {

    Create.getAllPublicGames($rootScope.user)
      .then(function(res) {
        $scope.publicGames = res.data;
        console.log("Public Games: ", res.data);
      });
  }

})

.controller('CreateViewCtrl', function($scope, $rootScope, $ionicViewService, Create) {
  $scope.createNewGame = function(prompt) {
    var backView = $ionicViewService.getBackView();
    backView && backView.go();
    // $location.path('/main');
    var prompt = this.prompt;
    console.log($rootScope.user.id, prompt);
    Create.createNewGame($rootScope.user.id, prompt)
  }
})

.controller('AccountCtrl', function($scope) {

})

.controller('GameCtrl', function($scope, $rootScope, $http, GamesFactory, $cordovaCamera, $ionicLoading, $ionicViewService) {
  $scope.takePicture = function() {
    var options = {
      quality: 30,
      destinationType: Camera.DestinationType.DATA_URL,
      sourceType: Camera.PictureSourceType.CAMERA,
      allowEdit: true,
      encodingType: Camera.EncodingType.JPEG,
      targetWidth: 300,
      targetHeight: 300,
      popoverOptions: CameraPopoverOptions,
      saveToPhotoAlbum: true
    };

    $cordovaCamera.getPicture(options)
      .then(function(imageData) {
        //Changed to png
        $scope.imgURI = "data:image/png;base64," + imageData;
      })
      .catch(function(err) {
        // An error occured. Show a message to the user
      });
  }

  $scope.selectPicture = function() {
    var options = {
      targetWidth: 300,
      targetHeight: 300,
      quality: 30,
      destinationType: Camera.DestinationType.DATA_URL,
      sourceType: Camera.PictureSourceType.PHOTOLIBRARY
    };

    $cordovaCamera.getPicture(options)
      .then(function(imageData) {
        //Changed to png
        $scope.imgURI = "data:image/png;base64," + imageData;
      })
      .catch(function(err) {
        // An error occured. Show a message to the user
      });
  };

  $scope.submitPhoto = function() {
    console.log("SUBMITPHOTO")

    var curr_game = $rootScope.currentGame;
    var backView = $ionicViewService.getBackView();

    $http({
        url: "http://10.8.16.232:8000/api/photo",
        method: "POST",
        params: {
          prompt_id: curr_game.id,
          user_id: $rootScope.user.id,
          //prompt_id: 1,
          //user_id: 2,
          image_string: $scope.imgURI
        }
      })
      .success(function(data, status, headers, config) {
        alert("SUBMIT SUCCESS", data)
        console.log("DATA", data);
        backView && backView.go();
      })
      .error(function(error) {
        alert("SUBMIT ERROR", error);
      })
  };

  $scope.getGameData = function() {
    GamesFactory.getGameData($rootScope.currentGame.id)
    .then(function(data) {
      console.log("Server Game Data", data)
      $scope.game = data;
      $scope.game.photos.forEach(function(photo) {
        if (photo.user_id === $rootScope.user.id) {
          $scope.userSubmission = photo;
        }
      })
    })
  };

  //Maybe not necessary, as getGameData should take care of this
  //$scope.getAllPhotosForGame = function() {
  //console.log("GetAllPhotos")
  //$scope.photos = [];
  //GamesFactory.getAllPhotosForGame($rootScope.currentGame.id)
  //.then(function(photos) {
  //photos.forEach(function(photo) {
  //$scope.photos.push(photo);
  //})
  //})
  //};

  $scope.selectPhoto = function(photo) {
    console.log("SELECTED PHOTO: ", photo)
    $scope.selectedPhoto = photo;
    console.log(photo.id)
  };

  $scope.chooseWinner = function() {
    GamesFactory.chooseWinner($scope.selectedPhoto.id, $rootScope.currentGame.id)
  };
})

.controller('MyGameCtrl', function($scope, GamesFactory, $rootScope) {


});
