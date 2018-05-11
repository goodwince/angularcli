var express = require('express');
var router = express.Router();


router.get('/', function (req, res, next) {
    return res.status(200).json({ item1: 'API Resources'});
});

router.get('/*', function (req, res, next) {
    res.status(404);
    console.log("Attempted to access API wrong URL: " + req.url );

    res.json({ title: "Unknown URL", url: req.url  });
    next();
});

module.exports = router;