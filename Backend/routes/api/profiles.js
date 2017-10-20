var mongoose = require('mongoose');
var router = require('express').Router();
var auth = require('../auth');
var User = mongoose.model('User');

router.param('username', function(req,res,next, username){
    User.findOne({username: username}).then(function(user){
        if(!user){return res.sendStatus(404);}

        req.profile = user;

        return next();
    }).catch(next);
});




router.get('/near', function(req,res,next){
    User.geoNear(
        {type: 'Point', coordinates: [parseFloat(req.query.lat), parseFloat(req.query.lng)]},
        {maxDistance: 50000, spherical: true}
    ).then(function(users){
        return res.json({
            profiles: users.map(function(user){
                return {profile: user.obj.toProfileJSONFor(), distance: user.dis};
            })
        })
    }).catch(next);
});

router.get('/:username', auth.optional, function(req,res,next){
    if(req.payload){
        User.findById(req.payload.id).then(function(user){
            if(!user){return res.json({profile: req.profile.toProfileJSONFor(false)})}

            return res.json({profile: req.profile.toProfileJSONFor(user)});
        }).catch(next);
    } else {
        return res.json({profile: req.profile.toProfileJSONFor(false)});
    }
});


router.get('/', function(req,res,next){
    User.find({}).then(function(users){
        return res.json({
            profiles: users.map(function(user){
                return {profile: user.toProfileJSONFor()}
            })
        })
    })
});


module.exports = router;