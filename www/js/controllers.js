angular.module('voto.controllers', [])


.controller('MainCtrl', function($scope, $rootScope, GamesFactory, $ionicPopup) {
  //Auth.isAuth();
  //$scope.signOut = Auth.signOut;
  //$scope.limitChar = function (string, limit) {
    //return (string.length < limit) ? string : string.substr(0, limit) + "...";
  //};
  //
  $rootScope.user = 'jorge.silva@thejsj.com';
  GamesFactory.getAllGamesForUser($rootScope.user)
    .then(function(res) {
      $scope.games = res.data.all;
      console.log("getAllGamesForUser: ", res.data);
    });

  $scope.saveGameToRootScope = function () {
    $rootScope.gameID = this.id;
  }

  $scope.loginPopup = function() {
    $scope.data = {}

    if (!$rootScope.username) {
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
        $rootScope.username = $scope.data.username;
      });
    }
  };
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
    GamesFactory.getAllPhotosForGame($rootScope.currentGame)
  }
});







