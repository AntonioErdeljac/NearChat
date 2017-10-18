var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');

var PrivateChatSchema = new mongoose.Schema({
    messages: [{type: mongoose.Schema.Types.ObjectId, ref:'PrivateMessage'}],
    roomName: {type: String, unique: true},
    users: [{type: mongoose.Schema.Types.ObjectId, ref:'User'}]
});

PrivateChatSchema.plugin(uniqueValidator, {message: "is already taken."});

PrivateChatSchema.methods.forUser = function(){
    return {
        messages: this.messages.map(function(message){
            return message.forUser()
        }),
        roomName: this.roomName,
        users: this.users.map(function(user){
            return user.toProfileJSONFor()
        })
    }
};

mongoose.model('PrivateChat', PrivateChatSchema);