angular.module('voto.controllers', [])

.controller('MainCtrl', function($scope, Main) {
  //Auth.isAuth();
  //$scope.signOut = Auth.signOut;
  //$scope.limitChar = function (string, limit) {
    //return (string.length < limit) ? string : string.substr(0, limit) + "...";
  //};
  //
  Main.getAllPromptsData()
    .then(function(res) {
      $scope.prompts = res.data.all;
      console.log("getAllPrompts: ", res.data);
    });
})

.controller('CreateCtrl', function($scope, Create) {
  $scope.games = Create.all();
})

.controller('CreateViewCtrl', function($scope, $stateParams, Create) {

})

.controller('AccountCtrl', function($scope) {

});
