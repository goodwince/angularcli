const path = require('path');
const express = require('express');
var bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

var apiHeroRoutes = require('./routes/apiHero');
var apiRoutes = require('./routes/api');
var authController = require('./routes/authController');

var db = require('./db');

// If an incoming request uses
// a protocol other than HTTPS,
// redirect that request to the
// same url but with HTTPS
const forceSSL = function() {
  return function (req, res, next) {
    if (req.headers['x-forwarded-proto'] !== 'https') {
      return res.redirect(['https://', req.get('Host'), req.url].join(''));
    }
    next();
  }
}

var env = process.env.NODE_ENV || 'dev';

if (env == 'production') {
    // Instruct the app
    // to use the forceSSL
    // middleware
    console.log('Booting in % mode forced SSL', env);    
    app.use(forceSSL());
}

// Run the app by serving the static files
// in the dist directory
app.use(express.static(__dirname + '/dist/angular-tour-of-heroes'));
//routing and controllers


app.use('/api/heroes', apiHeroRoutes);
app.use('/api/auth', authController);
app.use('/api', apiRoutes);

//all non-api urls return dashboard
app.get('/*', function(req, res) {
   res.sendFile(path.join(__dirname + '/dist/angular-tour-of-heroes/index.html'));
}); 

app.use(function logJsonParseError(err, req, res, next) {
  if (err.status === 400 && err.name === 'SyntaxError' && err.body) {
    // Display extra information for JSON parses
    console.log('JSON body parser error.')
    console.log(req.method + ' ' + req.url)
    console.log(err.body.slice(0, 100).toString())
  }

  next(err)
})
// Start the app by listening on the default
// Heroku port
app.listen(process.env.PORT || 8080);