var router = require('express').Router();

router.use('/', require('./users'));
router.use('/profiles', require('./profiles'));

module.exports = router;
