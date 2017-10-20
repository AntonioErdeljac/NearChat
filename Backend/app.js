var fs = require('fs'),
    http = require('http'),
    path = require('path'),
    methods = require('methods'),
    express = require('express'),
    bodyParser = require('body-parser'),
    session = require('express-session'),
    cors = require('cors'),
    passport = require('passport'),
    errorhandler = require('errorhandler'),
    mongoose = require('mongoose');
    socket = require('socket.io');

var isProduction = process.env.NODE_ENV === 'production';

// Create global app object
var app = express();

app.use(cors());

// Normal express config defaults
app.use(require('morgan')('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(require('method-override')());
app.use(express.static(__dirname + '/public'));

app.use(session({ secret: 'conduit', cookie: { maxAge: 60000 }, resave: false, saveUninitialized: false  }));

if (!isProduction) {
  app.use(errorhandler());
}

if(isProduction){
  mongoose.connect(process.env.MONGODB_URI);
} else {
  mongoose.connect('mongodb://localhost/nearchat');
  mongoose.set('debug', true);
}

require('./models/User');
require('./models/GlobalChat');
require('./models/GlobalMessage');
require('./models/PrivateChat');
require('./models/PrivateMessage');
require('./config/passport');
app.use(require('./routes'));

var User = mongoose.model('User');
var GlobalMessage = mongoose.model('GlobalMessage');
var GlobalChat = mongoose.model('GlobalChat');
var PrivateChat = mongoose.model('PrivateChat');
var PrivateMessage = mongoose.model('PrivateMessage');

/// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

/// error handlers

// development error handler
// will print stacktrace
if (!isProduction) {
  app.use(function(err, req, res, next) {
    console.log(err.stack);

    res.status(err.status || 500);

    res.json({'errors': {
      message: err.message,
      error: err
    }});
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.json({'errors': {
    message: err.message,
    error: {}
  }});
});

// finally, let's start our server...
var server = app.listen( process.env.PORT || 8000, function(){
  console.log('Listening on port ' + server.address().port);
});




var io = socket(server);

io.on('connection', function(socket){
  console.log(socket.id);


    socket.on('SEND_MESSAGE', function(data){
      console.log('server je primio poruku');
      User.findOne({username: data.author}).then(function(user){
        if(!user){return res.sendStatus(401);}

        var message = new GlobalMessage();
        message.author = user;
        message.message = data.message;
        message.save();

        GlobalChat.findOne({name: 'global'}).then(function(chat){
          chat.messages.push(message);
          chat.save();
        });

        var profileUser = user.toProfileJSONFor();

        io.in('global').emit('RECEIVE_MESSAGE', {
          message: data.message,
            author: profileUser
        })
      });
    });

    socket.on('SEND_TYPING', function(data){
      User.findOne({username: data.author}).then(function(user){
        if(!user){return res.sendStatus(401);}
        var profileUser = user.toProfileJSONFor();

        socket.broadcast.to('global').emit('RECEIVE_TYPING', {
          author: profileUser
        });
      })
    });

    socket.on('JOIN_GLOBAL_CHAT', function(data){
      GlobalChat.findOne({name: 'global'})
          .populate('messages')
          .populate({
              path: 'messages',
              populate: {
                path: 'author'
              }
          }).then(function(chat){
          socket.join('global');
          io.emit('JOINED_GLOBAL', {
              messages: chat.messages
          });
      });
    });

    socket.on('JOIN_PRIVATE_CHAT', function(data){
      console.log('JOINED PRIVATE CHAT', data.yourRoom);
      socket.join(data.yourRoom);
    });

    socket.on('SEND_PRIVATE_MESSAGE', function(data){
        console.log('SENDED PRIVATEM ESSAGE TO SEERverS', data);
      User.findOne({username: data.author}).then(function(user){
          User.findOne({username: data.receiver}).then(function(receiver){
              PrivateChat.findOne({roomName: data.yourRoom}).then(function(chat){
                    if(!chat) {
                        var newChat = new PrivateChat();
                        newChat.roomName = data.yourRoom;
                        newChat.users.push(receiver);
                        newChat.users.push(user);
                        newChat.save();

                        var message = new PrivateMessage();
                        message.author = user;
                        message.receiver = receiver;
                        message.message = data.message;
                        message.save();

                        newChat.messages.push(message);
                        newChat.save();


                        PrivateChat.findOne({roomName: data.guestRoom}).then(function(chat){
                            if(!chat) {
                                var newChat = new PrivateChat();
                                newChat.roomName = data.guestRoom;
                                newChat.users.push(receiver);
                                newChat.users.push(user);
                                newChat.save();

                                var message = new PrivateMessage();
                                message.author = user;
                                message.receiver = receiver;
                                message.message = data.message;
                                message.save();

                                newChat.messages.push(message);
                                newChat.save();
                            } else {
                                var message = new PrivateMessage();
                                message.author = user;
                                message.receiver = receiver;
                                message.message = data.message;
                                message.save();

                                chat.messages.push(message);
                                return chat.save();
                            }
                        });
                    } else {
                        var message = new PrivateMessage();
                        message.author = user;
                        message.receiver = receiver;
                        message.message = data.message;
                        message.save();

                        chat.messages.push(message);
                        chat.save();

                        PrivateChat.findOne({roomName: data.guestRoom}).then(function(chat){
                                var message = new PrivateMessage();
                                message.author = user;
                                message.receiver = receiver;
                                message.message = data.message;
                                message.save();

                                chat.messages.push(message);
                                return chat.save();

                        });
                    }
              });
          });




          const profileUser = user.toProfileJSONFor();
          console.log(profileUser, 'IM HERE')
          io.in(data.yourRoom).emit('RECEIVE_PRIVATE_MESSAGE', {
              author: profileUser,
              message: data.message
          });
          io.in(data.guestRoom).emit('RECEIVE_PRIVATE_MESSAGE', {
              author: profileUser,
              message: data.message
          })
      })

    });

    socket.on('JOIN_USER_ROOM', function(data){
        socket.join(data.user);
    });

    socket.on('LOCATION_UPDATE', function(data) {
        User.findOne({username: data.user}).then(function (user) {
            if (!user) {
                return res.sendStatus(401);
            }

            user.geometry = {
                type: "<GeoJSON type>",
                coordinates: [
                    parseFloat(data.lat),
                    parseFloat(data.lng)
                ]
            };
            return user.save().then(function () {
                io.emit('RECEIVE_LOCATION_UPDATE');
            })

        });

    });
    socket.on('RECEIVED_LOCATION_UPDATE_ALL', function(data){
        User.findOne({username: data.user}).then(function(user){
            User.geoNear(
                {type: "Point", coordinates:[user.geometry.coordinates[0], user.geometry.coordinates[1]]},
                {maxDistance: 10000, spherical: true}
            ).then(function(users){
                const profiles = {
                    profiles: users.map(function(user){
                        return {profile: user.obj.toProfileJSONFor(), distance: user.dis}
                    })
                };
                console.log('UPDATEEEEEEEEEEEEEEEEEEEEEEEES',users);

                io.in(data.user).emit('RECEIVE_NEW_USERS', {
                    profiles: profiles
                });
            })
        })
    });

    socket.on('disconnect', function(){
      socket.disconnect();
    })
});

