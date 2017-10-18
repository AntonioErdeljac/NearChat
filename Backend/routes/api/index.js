var router = require('express').Router();

router.use('/', require('./users'));
router.use('/profiles', require('./profiles'));
router.use('/globalchat', require('./globalChat'));
router.use('/privatechat', require('./privateChat'));

module.exports = router;
