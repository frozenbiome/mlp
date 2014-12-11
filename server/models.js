//use bookshelf and knex to

//user model - email, password,
//model for promts - one to many photo, winner - photo id, start time and end time, voting end time, title
//photo - one to one with user, id, upvotes

var bluebird = require('bluebird');
var bcrypt = require('bcrypt-nodejs');
var db = require('./db');
var models = {};

// User
models.User = db.Model.extend({
  tableName: 'users',
  hasTimestamps: true,
  initialize: function () {
    this.on('creating', this.addPassword.bind(this));
  },
  addPassword: function (model) {
    var cipher = bluebird.promisify(bcrypt.hash);
    return cipher(model.attributes.password, null, null)
      .then(function (hash) {
        delete model.attributes.password;
        delete this.password;
        model.attributes.password = hash;
        this.password = hash;
      }.bind(this));
  },
  checkPassword: function (password) {
    var compare = bluebird.promisify(bcrypt.compare);
    return compare(password, this.get('password'))
      .then(function (isMatch) {
        return isMatch;
      });
  },
  photo: function () {
    return this.hasMany(models.Photo);
  },
  game: function () {
    return this.hasMany(models.Game, 'user_id');
  },
  winner: function () {
    return this.hasMany(models.Game, 'winner_id');
  }
});

// Game - one to many photo, winner - photo id, start time and end time, voting end time, title
models.Game = db.Model.extend({
  tableName: 'games',
  hasTimestamps: true,
  photos: function () {
    return this.hasMany(models.Photo, 'prompt_id');
  },
  owner: function () {
    return this.belongsTo(models.User);
  },
  winner: function () {
    return this.belongsTo(models.Photo, 'winner_id');
  },
  user: function () {
    return this.hasMany(models.User)
  }
});

// Photo - one to one with user, id, upvotes
models.Photo = db.Model.extend({
  tableName: 'photos',
  hasTimestamps: true,
  user: function () {
    return this.belongsTo(models.User);
  },
  winner: function () {
    return this.hasOne(models.Game, 'winner_id');
  },
  game: function () {
    return this.belongsTo(models.Game);
  }
});

// Comment
models.Comment = db.Model.extend({
  tableName: 'comments',
  hasTimestamps: true,
  user: function () {
    return this.belongsTo(models.User);
  },
  game: function () {
    return this.belongsTo(models.Game);
  },
});

module.exports = models;