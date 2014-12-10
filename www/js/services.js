angular.module('voto.services', [])

/**
 * A simple example service that returns some data.
 */
.factory('Create', function() {
  // Might use a resource here that returns a JSON array

  // Some fake testing data
  var games = [
    { prompt: 'Dogs', creator: 'Scruff McGruff' },
    { prompt: 'War', creator: 'G.I. Joe' },
    { prompt: 'Hair', creator: 'Miss Frizzle' },
    { prompt: 'Pokemon', creator: 'Ash Ketchum' }
  ];

  return {
    all: function() {
      return games;
    }
  }
});
