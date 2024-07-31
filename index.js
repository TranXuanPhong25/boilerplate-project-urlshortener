require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const dns = require('dns');
const { generateShortCode, saveUrl, getOriginalUrl,checkDuplicateShortCode } = require('./utils');
// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use('/public', express.static(`${process.cwd()}/public`));

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

// Define a schema for the URL model
const urlSchema = new mongoose.Schema({
  original_url: String,
  short_url: String
});

// Create a URL model
const Url = mongoose.model('Url', urlSchema);

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});
// Create a short URL
app.post('/api/shorturl', async function(req, res) {
  // Get the original URL from the request body
  const originalUrl = req.body.url;
  // Check if the URL is valid
  const url = new URL(originalUrl);
  const hostname = url.hostname;
  // Check if the hostname is valid
  dns.lookup(hostname, async (err) => {
    if (err) {
      res.json({ error: 'invalid URL' });
      return;
    }
  });  
  // Generate a unique short code for the URL
  let shortCode = generateShortCode();
  while(!checkDuplicateShortCode(shortCode, Url)) {
    shortCode = generateShortCode();
  }
  // Save the original URL and short code in a database or data store
  await saveUrl(originalUrl, shortCode, Url);

  // Return the short URL to the client
  res.json({ 
    original_url : originalUrl,
    short_url: shortCode
  });
});

// Redirect to the original URL
app.get('/api/shorturl/:shortCode', async function(req, res) {
  // Get the short code from the request parameters
  const shortCode = req.params.shortCode;

  // Retrieve the original URL from the database or data store using the short code
  const originalUrl = await getOriginalUrl(shortCode, Url);

  
  if (originalUrl) {
    // Redirect to the original URL only if it is different from the current URL
    res.redirect(originalUrl);
  } else {
    // Handle invalid short code
    res.status(404).json({ error: 'Invalid short code' });
  }
});

// Your first API endpoint
app.get('/api/shorturl', function(req, res) {
  res.json({ greeting: 'hello API' });
});

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
