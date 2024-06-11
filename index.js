require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const dns = require('dns');

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.urlencoded({ extended: true }))

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function (req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Database
let urlDatabase = {};
let id = 1;

// Your first API endpoint
app.get('/api/hello', function (req, res) {
  res.json({ greeting: 'hello API' });
});

app.post('/api/shorturl', (req, res) => {
  const userUrl = req.body.url
  const parsedUrl = new URL(userUrl)
  const hostname = parsedUrl.hostname

  dns.lookup(hostname, (err, address) => {
    if (err) {
      res.json({ error: 'invalid URL' })
    } else {
      const shortUrl = id++
      urlDatabase[shortUrl] = userUrl
      res.json({ original_url: userUrl, short_url: shortUrl })
      console.log(urlDatabase, id)
    }
  })
})

app.get('/api/shorturl/:shorturl', (req, res) => {
  const userShortUrl = req.params.shorturl
  const originalUrl = urlDatabase[userShortUrl]

  if (originalUrl) {
    res.redirect(originalUrl)
  } else {
    res.json({ error: 'Provided shorturl doesnt exist in database' })
  }
})

// {
//   "original_url": "url",
//   "short_url": 5025
// }

app.listen(port, function () {
  console.log(`Listening on port ${port}`);
});
