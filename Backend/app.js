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
require('./config/passport');
app.use(require('./routes'));

var User = mongoose.model('User');
var GlobalMessage = mongoose.model('GlobalMessage');
var GlobalChat = mongoose.model('GlobalChat');

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

    socket.on('disconnect', function(){
      socket.disconnect();
    })
});

