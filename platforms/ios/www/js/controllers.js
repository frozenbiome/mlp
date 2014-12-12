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

  $scope.getAllGamesForUser = function () {
    if ($rootScope.user) {
      GamesFactory.getAllGamesForUser($rootScope.user)
      .then(function(res) {
        $scope.games = res.data.all;
        console.log("getAllGamesForUser: ", res.data);
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
          $rootScope.user = user
          $scope.getAllGamesForUser();
        })
      });
    }
  }();

})

.controller('CreateCtrl', function($scope, Create) {
  $scope.games = Create.all();
})

.controller('CreateViewCtrl', function($scope, $ionicViewService, Create) {
  $scope.createNewGame = function(topic) {
    var backView = $ionicViewService.getBackView();
    backView && backView.go();
    // $location.path('/main');
    this.topic = topic;
    console.log(this.topic);
    Create.createNewGame()
  }
})

.controller('AccountCtrl', function($scope) {

})

.controller('GameCtrl', function($scope, GamesFactory) {
  $scope.submitPhoto = function() {
    console.log('submitted')
  }
})

.controller('MyGameCtrl', function($scope, GamesFactory, $rootScope) {

  $scope.getAllPhotosForGame = function() {
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

});







