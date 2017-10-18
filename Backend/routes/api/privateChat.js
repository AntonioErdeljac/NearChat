var router = require('express').Router();
var mongoose = require('mongoose');
var PrivateChat = mongoose.model('PrivateChat');
var PrivateMessage = mongoose.model('PrivateMessage');
var auth = require('../auth');
var User = mongoose.model('User');


router.param('roomname', function(req,res,next,roomName){
    PrivateChat.findOne({roomName: roomName})
        .populate('messages')
        .populate('users')
        .populate({
            path: 'messages',
            populate: {
                path: 'author'
            }
        })
        .populate({
            path: 'messages',
            populate: {
                path: 'receiver'
            }
        })
        .then(function(chat){
            if(!chat){
                return res.sendStatus(404);
            }
            req.chat = chat.forUser();

            return next();
    }).catch(next);
});


router.get('/:roomname', function(req,res,next){

        return res.json({
            messages: req.chat.messages
        });
});

module.exports = router;