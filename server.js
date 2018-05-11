const path = require('path');
const express = require('express');
const app = express();
var appRoutes = require('./routes/app');
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
console.log('booting in %s mode', env);

if (env != 'dev') {
    // Instruct the app
    // to use the forceSSL
    // middleware
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

//another way to catch 404s
app.use(function(req, res, next){
    res.status(404);
  
    // respond with html page
    if (req.accepts('html')) {
      res.render('404', { url: req.url });
      return;
    }
  
    // respond with json
    if (req.accepts('json')) {
      res.send({ error: 'Not found' });
      return;
    }
  
    // default to plain-text. send()
    res.type('txt').send('Not found');
});

// Start the app by listening on the default
// Heroku port
app.listen(process.env.PORT || 8080);