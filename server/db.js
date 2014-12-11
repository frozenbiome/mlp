//user model - email, password,
//model for promts - one to many photo, winner - photo id, start time and end time, voting end time, title
//photo - one to one with user, id, upvotes

var knex = require('knex');
var path = require('path');

var db = knex({
  client: 'sqlite3',
  connection: {
    host: '127.0.0.1',
    user: 'your_database_user',
    password: 'password',
    database: 'majorleguedb',
    charset: 'utf8',
    filename: path.join(__dirname, './shortly.sqlite')
  }
});

//user model - email, password,
db.schema.hasTable('users').then(function (exists) {
  if (!exists) {
    db.schema.createTable('users', function (user) {
      user.increments('id').primary();
      user.string('email', 255);
      user.string('password', 255);
      user.string('photoFilename', 255); //Relative to /media/
      user.timestamps();
    }).then(function (table) {
      console.log('Created Table', table);
    });
  }
});

//friends user_user join
db.schema.hasTable('user_user-join').then(function (exists) {
  if (!exists) {
    db.schema.createTable('user_user-join', function (friends) {
      friends.integer('friend1').references('users.id');
      friends.integer('friend2').references('users.id');
      friends.boolean('accepted')
    })
  }
})

// Model for games - one to many photo, winner - photo id, start time and end time, voting end time, title
db.schema.hasTable('games').then(function (exists) {
  if (!exists) {
    db.schema.createTable('games', function (game) {
      game.increments('id').primary();
      game.string('prompt', 255);
      game.integer('winPhoto_id').references('photos.id');
      game.integer('winPlayer_id').references('users.id');
      game.integer('owner_id').references('users.id');
      game.timestamp('startTime'); // TODO: Change to lower_case
      game.timestamp('endTime'); // TODO: Change to lower_case
      game.timestamp('votingEndTime'); // TODO: Change to lower_case
      game.timestamps();
    }).then(function (table) {
      console.log('Created Table', table);
    });
  }
});

// Photo - one to one with user, id, upvotes
db.schema.hasTable('photos').then(function (exists) {
  if (!exists) {
    db.schema.createTable('photos', function (photo) {
      photo.increments('id').primary();
      photo.string('filename', 255); // Relative to /media/
      photo.integer('user_id').references('users.id');
      photo.integer('game_id').references('games.id');
      photo.timestamps();
    }).then(function (table) {
      console.log('Created Table', table);
    });
  }
});

// User_Game_Photo-Join
db.schema.hasTable('user_game_photo-join').then(function (exists) {
  if (!exists) {
    db.schema.createTable('user_game_photo-join', function (ugpj) {
      ugpj.integer('user_id').references('users.id');
      ugpj.integer('game_id').references('games.id');
      ugpj.integer('photo_id').references('photos.id');
      ugpj.boolean('joined');
      ugpj.boolean('submitted');
    }).then(function (table) {
      console.log('Created Table', table);
    });
  }
});

// Comment - one to one with user, belongsTo games - needs a user and needs a photo
db.schema.hasTable('comments').then(function (exists) {
  if (!exists) {
    db.schema.createTable('comments', function (photo) {
      photo.increments('id').primary();
      photo.string('content', 255).notNullable();
      photo.integer('user_id').references('users.id').notNullable();
      photo.integer('prompt_id').references('games.id').notNullable();
      photo.timestamps();
    }).then(function (table) {
      console.log('Created Table', table);
    });
  }
});

var bookshelf = require('bookshelf')(db);
module.exports = bookshelf;