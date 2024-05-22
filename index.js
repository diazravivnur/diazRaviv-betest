const express = require('express');
const dotenv = require('dotenv');
const CommonHelper = require('./server/helpers/commonHelper');
const app = express();
const Port = 8080;

// Import routes
const Users = require('./server/api/users');

dotenv.config();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Handling Invalid Input
app.use((err, req, res, next) => {
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({ error: 'Invalid JSON format' });
  }
  next(err);
});

// Route middlewares
app.use('/auth', Users);

// Sys ping api
app.get('/sys/ping', (req, res) => {
  req.startTime = process.hrtime();
  res.send('ok');
});

app.listen(Port, () => {
  CommonHelper.log(['Info'], `Server started on port ${Port}`);
});
