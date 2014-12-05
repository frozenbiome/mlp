angular.module("mlp.loading",['ui.router'])

.controller("loadingController", function ($scope, $state, $timeout){
  console.log("I am the loading controller");

  // Representation of a loading screen
  $timeout(function () {
    $state.go('logIn');
  }, 100000);

  // Realistically: Needs to check if there's a session
  	// if session === true && authenticated
  	  // $state.go('prompts');
  	// else session === false
  	  // $state.go('logIn');

});