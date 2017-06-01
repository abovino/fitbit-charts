const express = require('express');
const router = express.Router();
const auth = require('./controllers/passport');
const request = require('request-promise');


router.get('/', function(req, res) {
  res.render('index.handlebars');
});

router.get('/auth/fitbit', auth.authenticate('fitbit', {scope: ['activity', 'heartrate', 'location', 'profile']}));
router.get('/auth/fitbit/callback', auth.authenticate('fitbit', {
  successRedirect: '/auth/fitbit/success',
  failureRedirect: '/auth/fitbit/failure'
}));

router.get('/auth/fitbit/success', isAuthenticated, (req, res) => {
  var response;
  request('https://api.fitbit.com/1/user/-/activities/steps/date/2017-05-30/7d.json', {
    headers: {
      'User-Agent': 'Request-Promise',
      'Authorization': 'Bearer ' + req.user.accessToken
    }
  }).then(function(data) {
    console.log('FITBIT RESPONSE');
    response = JSON.parse(data);
    response = response['activities-steps'];
    console.log(response);
    res.render('user.handlebars', { data: response, user: req.user });
  });
});

router.get('/update', isAuthenticated, (req, res) => {
  var response;
  request('https://api.fitbit.com/1/user/-/activities/steps/date/2017-05-30/30d.json', {
    headers: {
      'User-Agent': 'Request-Promise',
      'Authorization': 'Bearer ' + req.user.accessToken
    }
  }).then(function(data) {
    console.log('FITBIT RESPONSE');
    response = JSON.parse(data);
    response = response['activities-steps'];
    console.log(response);
    res.send(response);
  });
});

router.get('/auth/fitbit/failure', (req, res) => {
	res.send('Authentication FAIL');
});

function isAuthenticated(req, res, next) {
	console.log("REQ.USER");
  // console.log(req.user.profile.id);
  if (req.user)
    return next();  
  // if req.user does not exist redirect them to the fail page.  Here you can either redirect users back to the login page
  res.redirect('/auth/fitbit/failure');
}

module.exports = router;