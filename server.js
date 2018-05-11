const path = require('path');
const express = require('express');
const app = express();
var apiHeroRoutes = require('./routes/apiHero');
var apiRoutes = require('./routes/api');

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

app.use('/api/heroes', apiHeroRoutes);
app.use('/api', apiRoutes);

//all non-api urls return dashboard
app.get('/*', function(req, res) {
   res.sendFile(path.join(__dirname + '/dist/angular-tour-of-heroes/index.html'));
}); 


// Start the app by listening on the default
// Heroku port
app.listen(process.env.PORT || 8080);