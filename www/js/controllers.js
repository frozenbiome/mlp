angular.module('voto.controllers', [])

.controller('MainCtrl', function($scope, Main) {
  $scope.games = Main.all();
})

.controller('GameCtrl', function($scope, Main) {
  $scope.games = Main.all();
})

.controller('CreateCtrl', function($scope, Create) {
  $scope.games = Create.all();
})

.controller('CreateViewCtrl', function($scope, $stateParams, Create) {

})

.controller('AccountCtrl', function($scope) {

});
