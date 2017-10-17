var mongoose = require('mongoose');

var GlobalChatSchema = new mongoose.Schema({
    name: String,
    messages: [{type: mongoose.Schema.Types.ObjectId, ref:'GlobalMessage'}],
    activeUsers: [{type: mongoose.Schema.Types.ObjectId, ref:'User'}]
});

mongoose.model('GlobalChat', GlobalChatSchema);