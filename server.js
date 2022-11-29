'use strict';
require('dotenv').config({ path: './config.env' }); // EDITED
const express     = require('express');
const bodyParser  = require('body-parser');
const cors        = require('cors');
const helmet      = require('helmet') // EDITED

const apiRoutes         = require('./routes/api.js');
const fccTestingRoutes  = require('./routes/fcctesting.js');
const runner            = require('./test-runner');

const app = express();

app.use('/public', express.static(process.cwd() + '/public'));

app.use(cors({origin: '*'})); //For FCC testing purposes only

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// EDITED
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      "scriptSrc": ["'self'"],
      "styleSrc": ["'self'"],
    },
  })
);

//Index page (static HTML)
app.route('/')
  .get(function (req, res) {
    res.sendFile(process.cwd() + '/views/index.html');
  });

//For FCC testing purposes
fccTestingRoutes(app);

//Routing for API 
// apiRoutes(app);  
app.use('/api', apiRoutes); //EDITED
    
//404 Not Found Middleware
app.use(function(req, res, next) {
  res.status(404)
    .type('text')
    .send('Not Found');
});


//+ Connect to MongoDB // EDITED
const mongoose = require('mongoose');

let DB = process.env.DB;

const DB_OPTIONS = {
    // useNewUrlParser: true,
    // useUnifiedTopology: true,
};
mongoose
    .connect(DB, DB_OPTIONS)
    .then(() => console.log('DB connection successful'))
    .catch((err) => console.log('Problem with database connection ', err));

//Start our server and tests!
const listener = app.listen(process.env.PORT || 3000, function () {
  console.log('Your app is listening on port ' + listener.address().port);
  if(process.env.NODE_ENV==='test') {
    console.log('Running Tests...');
    setTimeout(function () {
      try {
        runner.run();
      } catch(e) {
        console.log('Tests are not valid:');
        console.error(e);
      }
    }, 3500);
  }
});

module.exports = app; //for testing
