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

//Should get all games that a user has created
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
          console.log("PUSHING")
          result['all'].push(prompt.toJSON());
          //Push to closed if there's a winner id
          if(prompt.get('winner_id') !== undefined) {
            result['closed'].push(prompt.toJSON());
          }
        }
      });

      //var timeNow = Date.now();
      //collection.forEach(function (prompt) {
        //var isEnded = (prompt.get('endTime') - timeNow) < 0;
        //var isVoteEnded = (prompt.get('votingEndTime') - timeNow) < 0;
        //if (isVoteEnded || prompt.get('winner') !== undefined) {
          //result['closed'].push(prompt.toJSON());
        //} else {
          //if (isEnded) {
            //result['pending'].push(prompt.toJSON());
          //} else {
            //result['open'].push(prompt.toJSON());
          //}
        //}
      //});



      res.json(result);
    });
});

//Should get all games that a user has submitted to
promptRouter.get('/submitted', function (req, res) {
  // 1. Query all photoos where user.id = userId
  // 2. Query all prompt ids for those photos
  // 3. Query all prompts where user.id === userId or id in promptIds


 // get all prompts with photos
 // get all users for photos
 // filter prompts by promts where any of the photos haver a prompt.photos[i]user.id === userId
 // or prompt.user_id is userId
});

//Gets all prompts
promptRouter.get('/all', function (req, res) {
  console.log("get to /all")
  models.Prompt.fetchAll({
    //Grabs all the data about the related winner and user
      withRelated: ['winner', 'user', 'photo']
    })
    .then(function (collection) {
      var result = {
        all: collection.toJSON(),
        open: [],
        pending: [],
        closed: []
      };
      var timeNow = Date.now();
      collection.forEach(function (prompt) {
        var isEnded = (prompt.get('endTime') - timeNow) < 0;
        var isVoteEnded = (prompt.get('votingEndTime') - timeNow) < 0;
        if (isVoteEnded || prompt.get('winner') !== undefined) {
          result['closed'].push(prompt.toJSON());
        } else {
          if (isEnded) {
            result['pending'].push(prompt.toJSON());
          } else {
            result['open'].push(prompt.toJSON());
          }
        }
      });
      res.json(result);
    });
});

promptRouter.post('/', function (req, res) {
  var title = req.body.title || req.param('title');
  var startTime = req.body.startTime || req.param('startTime');
  var endTime = req.body.endTime || req.param('endTime');
  var votingEndTime = req.body.votingEndTime || req.param('votingEndTime');
  var userId = req.body.userId || req.param('userId');
  collections.Users
    .query('where', 'id', '=', userId)
    .fetchOne()
    .then(function (model) {
      if (!model) {
        throw new Error('User not Found');
      }
      if (!title || !startTime || !endTime || !votingEndTime || !userId) {
        throw new Error('Not All Fields Entered');
      }
      return true;
    })
    .then(function () {
      return new models.Prompt({
          title: title,
          user_id: userId, // We really need to normalize these
          startTime: startTime,
          endTime: endTime,
          votingEndTime: votingEndTime
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
  collections.Prompts
    .query('where', 'id', '=', req.param('id'))
    .fetchOne({
      withRelated: ['photos', 'user', 'winner']
    })
    .then(function (model) {
      var _model = model.toJSON();
      if (model.related('winner') !== undefined) {
        return model.related('winner')
          .fetch({
            withRelated: ['user']
          })
          .then(function (winnerPhoto) {
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
  var winnerId = req.body.photoId;
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
