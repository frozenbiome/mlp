angular.module('voto.controllers', [])

.controller('MainCtrl', function($scope) {})

.controller('CreateCtrl', function($scope, Create) {
  $scope.games = Create.all();	
})

// .controller('FriendsCtrl', function($scope, Friends) {
//   $scope.friends = Friends.all();
// })

// .controller('FriendDetailCtrl', function($scope, $stateParams, Friends) {
//   $scope.friend = Friends.get($stateParams.friendId);
// })

.controller('AccountCtrl', function($scope) {});
