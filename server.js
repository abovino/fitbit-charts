require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const logger = require('morgan');
const session = require('express-session');
const passport = require('passport');
const path = require('path');
const exhbs = require('express-handlebars');
const PORT = process.env.PORT || 3000;
const app = express();

// Require routes
const index = require('./routes/index');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '/public')));
app.use(logger('dev'));

app.use(session({ secret: 'secret' }));
app.use(passport.initialize());
app.use(passport.session());

app.engine('handlebars', exhbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

app.use('/', index);

app.listen(PORT, function() {
  console.log(`Server listening on PORT ${PORT}`);
});