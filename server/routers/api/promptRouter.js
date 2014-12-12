var express = require('express');
var collections = require('../../collections');
var models = require('../../models');

var promptRouter = express.Router();

//Should take a user email and send back the user id, creating a new user if the
//provided email is not found.
promptRouter.get('/user', function(req,res) {

  var user = req.query.user;
  console.log("LOOKING UP", user);

  new models.User({'email': user})
    .fetch()
    .then(function(model) {
      //If not found, create and return
      if (model === null) {
        new models.User({
          'email': user,
          'password': 'dummypass'
        })
        .save().then(function(model) {
          var result = {
            email: model.attributes.email,
            id: model.attributes.id
          }

          res.json(result);
        })
      //If found, just return
      } else {
        var result = {
          email: model.attributes.email,
          id: model.attributes.id
        }

        res.json(result);
      }
    })
})

//Gets all games that a user has created
promptRouter.get('/created', function (req, res) {

  var user_id = parseInt(req.query.user_id);

  //Get all prompts
  models.Prompt.fetchAll({
    //Grabs all the data about the related winner and user
      withRelated: ['winner', 'user']
    })
    .then(function (collection) {
      var result = {
        all: [],
        open: [],
        pending: [],
        closed: []
      };

      collection.forEach(function(prompt) {
        //Push if it was created by user
        if (prompt.get('user_id') === user_id) {
          console.log("1")
          result['all'].push(prompt.toJSON());

          //Push to open if there's no winner id, and closed if there is
          if(prompt.get('winner_id') === null) {
            console.log("2")
            result['open'].push(prompt.toJSON());
          } else {
            console.log("3")
            result['closed'].push(prompt.toJSON());
          }

        }
      });
      res.json(result);
    });
});

//Should get all games that a user has submitted to
promptRouter.get('/playing', function (req, res) {
  var user_id = parseInt(req.query.user_id);
  console.log("GET TO /SUBMITTED")

  //Query Photos table for all of this user's submissions
  models.Photo.fetchAll({
    withRelated: ['winner', 'user', 'prompt']
  })
  .then(function (collection) {
    var result = {
      all: [],
      open: [],
      pending: [],
      closed: []
    };

    collection.forEach(function(photo) {
      //If it was created by user
      if (photo.get('user_id') === user_id) {
        
        //Grab related prompt object. AWESUM KEWL
        var game = photo.related('prompt');
        console.log("4")
        result['all'].push(game.toJSON());

        //Push to open if there's no winner id, and closed if there is
        if(game.get('winner_id') === null) {
          console.log("5")
          result['open'].push(game.toJSON());
        } else {
          console.log("6")
          result['closed'].push(game.toJSON());
        }

      }
    });
    res.json(result);
  });
});

//Gets all prompts not made by a user
promptRouter.get('/all', function (req, res) {
  console.log("get to /all")
  
  var user_id = parseInt(req.query.user_id);
  console.log("GET TO ALL USER ID", user_id);

  models.Prompt.fetchAll({
    //Grabs all the data about the related winner and user
      withRelated: ['winner', 'user', 'photos']
    })
    .then(function (collection) {
      var result = {
        all: [],
        open: [],
        pending: [],
        closed: []
      };

      collection.forEach(function(prompt) {
        //If game was not created by user, push to all
        if (prompt.get('user_id') !== user_id) {
          result['all'].push(prompt);
          
          //If game is open
          if (prompt.get('winner_id') === null) {
            //Push to open array
            result['open'].push(prompt);

            //Grab all photos for game, if any are owned by user, 
            prompt.related('photos').forEach(function(photo) {
              if (photo.get('user_id') === user_id) {
                prompt['submitted'] = true;
              } else {
                prompt['submitted'] = false;
              }
            })


          } else {
            //Else, game is closed, push to closed
            result['closed'].push(prompt);
          }
        }
        
      });
      //var timeNow = Date.now();
      // collection.forEach(function (prompt) {
        // var isEnded = (prompt.get('endTime') - timeNow) < 0;
        // var isVoteEnded = (prompt.get('votingEndTime') - timeNow) < 0;
        // if (isVoteEnded || prompt.get('winner') !== undefined) {
        //   result['closed'].push(prompt.toJSON());
        // } else {
        //   if (isEnded) {
        //     result['pending'].push(prompt.toJSON());
        //   } else {
        //     result['open'].push(prompt.toJSON());
        //   }
        // }
      // });
      res.json(result);
    });
});

promptRouter.post('/', function (req, res) {
  var title = req.body.title || req.param('title');
  // var startTime = req.body.startTime || req.param('startTime');
  // var endTime = req.body.endTime || req.param('endTime');
  // var votingEndTime = req.body.votingEndTime || req.param('votingEndTime');
  var userId = req.body.userId || req.param('userId');
  collections.Users
    .query('where', 'id', '=', userId)
    .fetchOne()
    .then(function (model) {
      if (!model) {
        throw new Error('User not Found');
      }
      // if (!title || !startTime || !endTime || !votingEndTime || !userId) {
      if (!title || !userId) {
        throw new Error('Not All Fields Entered');
      }
      return true;
    })
    .then(function () {
      return new models.Prompt({
          title: title,
          user_id: userId, // We really need to normalize these
          // startTime: startTime,
          // endTime: endTime,
          // votingEndTime: votingEndTime
        })
        .save();
    })
    .then(function (model) {
      res.json(model.toJSON());
    }).catch(function (err) {
      console.log('Error:');
      console.log(err);
      res.status(404).end();
    });
});

promptRouter.get('/:id', function (req, res) {
  console.log("GETTING GAME DATA")

  collections.Prompts
    .query('where', 'id', '=', req.param('id'))
    .fetchOne({
      withRelated: ['photos', 'user', 'winner']
    })

    .then(function (model) {
      var _model = model.toJSON();
      //If there's a winner, return the winning photo
      if (model.related('winner') !== undefined) {
        return model.related('winner')
          .fetch({
            withRelated: ['user']
          })
          .then(function (winnerPhoto) {
            //Should be winnerPhoto?
            return model;
          });
      }
      return model;
    })

    .then(function (model) {
      if (!model) throw new Error('No Model Found');
      res.json(model.toJSON());

      return true;
    }).catch(function (err) {
      console.log('Error:');
      console.log(err);
      res.status(404).end();
    });
});

promptRouter.put('/:id', function (req, res) {
  var winnerId = req.body.photoID;
  collections.Prompts
    .query('where', 'id', '=', req.param('id'))
    .fetchOne()
    .then(function (prompt) {
      if (!prompt) res.status(404).end();
      return prompt.save({
        winner_id: winnerId
      }, {
        patch: true
      });
    })
    .then(function (model) {
      return res.status(201).json(model.toJSON());
    }).catch(function (err) {
      console.log('Error:');
      console.log(err);
      res.status(404).end();
    });
});

module.exports = promptRouter;
