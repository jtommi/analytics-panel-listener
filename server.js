const bodyParser = require('body-parser');
const cors = require('cors');
const express = require('express');
const mongoose = require('mongoose');
require('console-stamp')(console, 'HH:MM:ss.l');

const port = 8080;
const app = express();

// Get the DB settings from the config file
dbHostname = process.env.MONGODB_HOSTNAME;
dbPort = process.env.MONGODB_PORT;
dbAuthDatabase = process.env.MONGODB_AUTH_DATABASE;
dbDatabase = process.env.MONGODB_DATABASE;
dbUsername = process.env.MONGODB_USERNAME;
dbPassword = process.env.MONGODB_PASSWORD;

// Connect to MongoDB
mongodbConnectionString = `mongodb://${dbUsername}:${dbPassword}@${dbHostname}:${dbPort}/${dbAuthDatabase}`;
mongoose.connect(mongodbConnectionString, { useNewUrlParser: true, useUnifiedTopology: true });

app.use(bodyParser.json({ type: ['application/json', 'text/plain'] }));
app.use(cors());

const loadDashboardController = require('./controllers/loadDashboard');
const unloadDashboardController = require('./controllers/unloadDashboard');


const corsOptions = {
  origin: true,
  optionsSuccessStatus: 200,
};

const server = app.listen(port, () => {
  console.log('App listening on port %s', port);
});

// Handle dashboard load
app.post('/event', loadDashboardController);

// Handle dashboard unload
app.post('/event/:id', unloadDashboardController);

// Handle random GET request
app.get('*', (req, res) => {
  res.status(200).send("It's working");
});
