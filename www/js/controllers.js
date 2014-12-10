angular.module('voto.controllers', [])

.controller('MainCtrl', function($scope, Create) {
  $scope.games = Create.all();
})

.controller('CreateCtrl', function($scope, Create) {
  $scope.games = Create.all();
})

.controller('CreateViewCtrl', function($scope, $stateParams, Create) {

})

.controller('AccountCtrl', function($scope) {

});
