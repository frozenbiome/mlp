angular.module('voto.controllers', [])


.controller('MainCtrl', function($scope, $rootScope, GamesFactory, $ionicPopup) {
  //Auth.isAuth();
  //$scope.signOut = Auth.signOut;
  //$scope.limitChar = function (string, limit) {
    //return (string.length < limit) ? string : string.substr(0, limit) + "...";
  //};
  //

  $scope.saveGameToRootScope = function () {
    $rootScope.currentGame = this;
  }

  //Gets all games user created
  $scope.getAllGamesForUser = function () {
    if ($rootScope.user) {
      GamesFactory.getAllGamesForUser($rootScope.user)
      .then(function(res) {
        $scope.createdGames = res.data;
        console.log("Games User Created: ", res.data);
      });
    }
  }

  //Gets all games user submitted to
  $scope.getAllPlayingGames = function () {
    if ($rootScope.user) {
      GamesFactory.getAllPlayingGames($rootScope.user)
      .then(function(res) {
        $scope.playingGames = res.data;
        console.log("Games User Submitted to: ", res.data);
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
        buttons: [
          {
            text: '<b>Save</b>',
            type: 'button-positive',
            onTap: function(e) {
            }
          },
        ]
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

  $scope.getAllPublicGames = function () {

    Create.getAllPublicGames($rootScope.user)
    .then(function(res) {
      $scope.publicGames = res.data;
      console.log("Public Games: ", res.data);
    });
  }

})

.controller('CreateViewCtrl', function($scope, $ionicViewService, Create) {
  $scope.createNewGame = function(prompt) {
    var backView = $ionicViewService.getBackView();
    backView && backView.go();
    // $location.path('/main');
    var prompt = this.prompt;
    console.log(prompt);
    Create.createNewGame(prompt)
  }
})

.controller('AccountCtrl', function($scope) {

})

.controller('GameCtrl', function($scope, $rootScope, GamesFactory, $cordovaCamera) {
   $scope.takePicture = function() {
    var options = { 
        quality : 75, 
        destinationType : Camera.DestinationType.DATA_URL, 
        sourceType : Camera.PictureSourceType.CAMERA, 
        allowEdit : true,
        encodingType: Camera.EncodingType.JPEG,
        targetWidth: 300,
        targetHeight: 300,
        popoverOptions: CameraPopoverOptions,
        saveToPhotoAlbum: false
    };

    $cordovaCamera.getPicture(options).then(function(imageData) {
        $scope.imgURI = "data:image/jpeg;base64," + imageData;
    }, function(err) {
        // An error occured. Show a message to the user
    });
  }
  $scope.submitPhoto = function() {
    console.log('submitted')
  }
  $scope.getAllPhotosForGame = function() {
    console.log("GetAllPhotos")
    $scope.photos = [];
    GamesFactory.getAllPhotosForGame($rootScope.currentGame)
    .then(function(photos) {
      photos.forEach(function(photo) {
        $scope.photos.push(photo);
      })
    })
  }

  $scope.selectPhoto = function() {
    $scope.selectedPhoto = this;
  }

  $scope.chooseWinner = function() {
    GamesFactory.chooseWinner(this.id, $rootScope.currentGame.id)
  }
})

.controller('MyGameCtrl', function($scope, GamesFactory, $rootScope) {


});







