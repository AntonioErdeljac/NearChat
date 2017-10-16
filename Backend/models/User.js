var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');
var crypto = require('crypto');
var secret = require('../config').secret;
var Schema = mongoose.Schema;
var jwt = require('jsonwebtoken');

var UserSchema = new Schema({
    username: {type: String, lowercase: true, required:[true, "can't be blank"], unique: true, index: true},
    email: {type: String, lowercase: true, required: [true, "can't be blank"], unique: true, index: true},
    bio: String,
    image: String,
    hash: String,
    salt: String
}, {timestamps: true});

UserSchema.plugin(uniqueValidator, {message: "is already taken."});

UserSchema.methods.setPassword = function(password){
    this.salt = crypto.randomBytes(16).toString('hex');
    this.hash = crypto.pbkdf2Sync(password, this.salt, 10000, 512, 'sha512').toString('hex')
};

UserSchema.methods.validPassword = function(password){
    var hash = crypto.pbkdf2Sync(password, this.salt, 10000, 512, 'sha512').toString('hex');
    return this.hash === hash;
};

UserSchema.methods.generateJWT = function(){
    var today = new Date();
    var exp = new Date(today);
    exp.setDate(today.getDate() + 60);

    return jwt.sign({
        username: this.username,
        id: this._id,
        exp: parseInt(exp.getTime()/1000)
    }, secret);
};

UserSchema.methods.toAuthJSON = function(){
    return {
        username: this.username,
        email: this.email,
        bio: this.bio,
        image: this.image,
        token: this.generateJWT()
    };
};

UserSchema.methods.toProfileJSONFor = function(user){
    return {
        username: this.username,
        bio: this.bio,
        image: this.image || "http://www.stickpng.com/assets/images/585e4bcdcb11b227491c3396.png",
        friends: false
    };
};

mongoose.model('User', UserSchema);