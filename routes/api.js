var express = require('express');
var router = express.Router();

router.get('/', function (req, res, next) {
    return res.status(200).json({ item1: 'API Resources'});
});

router.get('/*', function (req, res, next) {
    res.sendStatus(404);
});

module.exports = router;