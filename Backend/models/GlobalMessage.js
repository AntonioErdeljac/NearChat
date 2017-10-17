var mongoose = require('mongoose');

var GlobalMessageSchema = new mongoose.Schema({
    author: {type: mongoose.Schema.Types.ObjectId, ref:'User'},
    message: String
});

GlobalMessageSchema.methods.forUser = function(){
    return {
        author: this.author.toProfileJSONFor(),
        message: this.message
    };
};

mongoose.model('GlobalMessage', GlobalMessageSchema);