require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});
// Create a short URL
app.post('/api/shorturl', function(req, res) {
  // Get the original URL from the request body
  const originalUrl = req.body.url;

  // Generate a unique short code for the URL
  const shortCode = generateShortCode();

  // Save the original URL and short code in a database or data store
  saveUrl(originalUrl, shortCode);

  // Return the short URL to the client
  res.json({ shortUrl: `https://your-domain.com/${shortCode}` });
});

// Redirect to the original URL
app.get('/:shortCode', function(req, res) {
  // Get the short code from the request parameters
  const shortCode = req.params.shortCode;

  // Retrieve the original URL from the database or data store using the short code
  const originalUrl = getOriginalUrl(shortCode);

  if (originalUrl) {
    // Redirect to the original URL
    res.redirect(originalUrl);
  } else {
    // Handle invalid short code
    res.status(404).json({ error: 'Invalid short code' });
  }
});

// Function to generate a unique short code
function generateShortCode() {
  // Implement your logic to generate a short code here
  // You can use libraries like shortid or nanoid to generate unique short codes
  // Example: return shortid.generate();
}

// Function to save the original URL and short code in a database or data store
function saveUrl(originalUrl, shortCode) {
  // Implement your logic to save the URL in a database or data store here
}

// Function to retrieve the original URL from the database or data store using the short code
function getOriginalUrl(shortCode) {
  // Implement your logic to retrieve the URL from the database or data store here
}
// Your first API endpoint
app.get('/api/shorturl', function(req, res) {
  res.json({ greeting: 'hello API' });
});

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
