var express = require('express');
var router = express.Router();

router.get('/*', function (req, res, next) {
    return res.status(200).json({ item1: 'heroes'});
});
module.exports = router;
