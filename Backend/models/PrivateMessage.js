var mongoose = require('mongoose');

var PrivateMessageSchema = new mongoose.Schema({
    message: String,
    author: {type: mongoose.Schema.Types.ObjectId, ref:'User'},
    receiver: {type: mongoose.Schema.Types.ObjectId, ref:'User'}
});

PrivateMessageSchema.methods.forUser = function(){
    return {
        message: this.message,
        author: this.author.toProfileJSONFor(),
        receiver: this.receiver.toProfileJSONFor()
    };
};

mongoose.model('PrivateMessage', PrivateMessageSchema);