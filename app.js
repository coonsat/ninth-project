'use strict';

// load modules
const express = require('express');
const morgan = require('morgan');
const { sequelize } = require('./models');
const bodyParser = require('body-parser');
const cors = require('cors');

// variable to enable global error logging
const enableGlobalErrorLogging = process.env.ENABLE_GLOBAL_ERROR_LOGGING === 'true';

// create the Express app
const app = express();
app.use(cors());
app.use(express.json());

// use body parser to read requests
app.use(bodyParser.urlencoded({ extended: true }));

// setup morgan which gives us http request logging
app.use(morgan('dev'));

// setup a friendly greeting for the root route
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to the REST API project!',
  });
});

// setup routes
const user = require('./routes');
const courses = require('./routes/courses');
app.use('/api/users', user);
app.use('/api/courses', courses);

// send 404 if no other route matched
app.use((req, res) => {
  res.status(404).json({
    message: 'Route Not Found',
  });
});

// // setup a global error handler
app.use((err, req, res, next) => {
  if (enableGlobalErrorLogging) {
    console.error(`Global error handler: ${JSON.stringify(err.stack)}`);
  }

  res.status(err.status || 500).json({
    message: err.message,
    error: {},
  });
});

// connect to db and test connection
(async () => {
  try {
      await sequelize.sync();
      await sequelize.authenticate();
      console.log('Successful database connection');
  } catch(error) {
      console.log('Unable to connect to the database', error);
      error.status = 500;
  }
})();

// set our port
const PORT = 5000;
app.set('port', process.env.PORT || PORT);

// start listening to port
const server = app.listen(app.get('port'), () => {
  console.log(`Express server is listening on port ${server.address().port}`);
});