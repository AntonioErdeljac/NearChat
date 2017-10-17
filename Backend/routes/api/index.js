var router = require('express').Router();

router.use('/', require('./users'));
router.use('/profiles', require('./profiles'));
router.use('/globalchat', require('./globalChat'));

module.exports = router;
