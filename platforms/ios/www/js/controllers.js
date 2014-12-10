angular.module('voto.controllers', [])

.controller('MainCtrl', function($scope, Main) {
<<<<<<< HEAD
  $scope.games = Main.all();
=======
  //Auth.isAuth();
  //$scope.signOut = Auth.signOut;
  //$scope.limitChar = function (string, limit) {
    //return (string.length < limit) ? string : string.substr(0, limit) + "...";
  //};
  Main.getAllPromptsData()
    .then(function(res) {
      console.log(res.data.all);
    });
  //Main.getAllPromptsData($scope.realPrompts)
    //.then(function (res) {
      //console.log(res.data);
      //var results = res.data;
      //_.each(results, function (status) {
        //_.each(status, function (prompt) {
          //prompt.startTime = moment(prompt.startTime);
          //prompt.endTime = moment(prompt.endTime);
          //prompt.votingEndTime = moment(prompt.votingEndTime);
        //});
      //});
      //$scope.status = results;
    //});
>>>>>>> Main view scaffold and controller. Gets all prompts from Grant's IP.
})

.controller('CreateCtrl', function($scope, Create) {
  $scope.games = Create.all();
})

.controller('CreateViewCtrl', function($scope, $stateParams, Create) {

})

.controller('AccountCtrl', function($scope) {

});
