angular.module('voto.controllers', [])

.controller('MainCtrl', function($scope, $rootScope, GamesFactory) {
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

});
