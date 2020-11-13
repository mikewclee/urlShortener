const express = require('express')
const mongoose = require("mongoose");
const ShortUrl = require("./models/shortUrl")

const PORT = process.env.PORT || 5000;
const app = express()
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Connect to the Mongo DB
mongoose.connect(
    process.env.MONGODB_URI || "mongodb://localhost/urlShortener",
    { useUnifiedTopology: true, useNewUrlParser: true, useCreateIndex: true }
  );
  app.set('view engine', 'ejs')
  app.use(express.urlencoded({ extended: false }))
  
  app.get('/', async (req, res) => {
    const shortUrls = await ShortUrl.find()
    res.render('index', { shortUrls: shortUrls })
  })
  
  app.post('/shortUrls', async (req, res) => {
    await ShortUrl.create({ full: req.body.fullUrl })
  
    res.redirect('/')
  })
  
  app.get('/:shortUrl', async (req, res) => {
    const shortUrl = await ShortUrl.findOne({ short: req.params.shortUrl })
    if (shortUrl == null) return res.sendStatus(404)
  
    shortUrl.clicks++
    shortUrl.save()
  
    res.redirect(shortUrl.full)
  })
  
app.listen(PORT, function() {
    console.log(`http://localhost:${PORT}`);
  });