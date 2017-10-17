var router = require('express').Router();
var mongoose = require('mongoose');
var GlobalChat = mongoose.model('GlobalChat');

router.post('/', function(req,res,next){
    var chat = new GlobalChat();
    chat.name = 'global';
    chat.save().then(function(){
        return res.json({message: 'sucessfuly created global chat'})
    })
});

router.get('/', function(req,res,next){
    GlobalChat.findOne({name: 'global'})
        .populate('messages')
        .populate({
            path: 'messages',
            populate: {
                path: 'author'
            }
        }).then(function(chat){
            return res.json({
                messages: chat.messages.map(function(message){
                    return message.forUser()
                })
            })
    })
});

router.delete('/', function(req,res,next){
    GlobalChat.findOne({name: 'global'})
        .populate('messages')
        .then(function(chat){
            chat.messages.map(function(message){
                message.remove();
            });
            chat.save().then(function(){
                return res.json({
                    message: 'removed all messages'
                })
            })
        })
});

module.exports = router;