// Routing requirements
const express = require('express');
const router = express.Router();

// Include API functions
const themoviedb = require('../api/themoviedb')
const newsapi = require('../api/newsapi')
const flickr = require('../api/flickr')
const s3Counter = require('../api/s3-counter')

// Initial home page route
router.get('/', function (req, res, next) {
  const title = "Movie News & Images"

  // Update persistence counter
  s3Counter.s3UpdateCounter()
  // Render home page with no content
  res.render('index', {title: title, s3_count: s3Counter.getCount(), articles: [], images: []})

  // Render home page with no content
  //res.render('index', {title: title, s3_count: s3Count, articles: [], images: []})
});

// Home page with POST request data
router.post('/', function (req, res, next) {
  const query = req.body.moviename

  // Error handling if no query
  if(query == "") {
    res.render("error", {message: "No query entered... ", error: query})
  }

  const title = "Movie News & Images: '" + query + "'"
  const maxResults = 10

  // Get movie titles based off query
  themoviedb.searchTheMovieDB(query).then((response) => {
    const total_results = response.total_results
    var results = 0;
    if(total_results > maxResults) {
      results = maxResults
    } else {
      results = total_results
    }

    var relevant_articles = []

    // Limited to take the first article title to save API requests and latency
    newsapi.searchNewsAPI(response.results[0].original_title).then((response) => {
      // Limit to 10 results
      if(response.totalResults != 0) {
        var total_results = 0;
        if(response.totalResults > maxResults) {
          total_results = maxResults
        } else {
          total_results = response.totalResults
        }

        // Concat all articles into single list
        for(j = 0; j < total_results; j++) {
          relevant_articles = relevant_articles.concat(response.articles[j])
        }                 
      }

      // Once the articles are retrieved
    }).then(() => {
      // Limited to take the first article title to save API requests and latency
      flickr.searchFlickr(response.results[0].original_title).then((response) => {
        // Update and get persistence counter
        s3Counter.s3UpdateCounter()

        // Render home page with all responses
        res.render('index', {title: title, s3_count: s3Counter.getCount(), articles: relevant_articles, images: response})
      
        // Flickr error handling
      }).catch((error) => {
        res.render('error', {message: "An error occured when fetching Flickr images for " + "'" + query + "'...", error: error})
      })

      // NewsAPI error handling
    }).catch((error) => {
      res.render('error', {message: "An error occured when fetching NewsAPI articles for " + "'" + query + "'...", error: error})
    })

    // The Movie DB error handling
  }).catch((error) => {
    res.render('error', {message: "An error occured when fetching The Movie Database titles for " + "'" + query + "'...", error: error})
  })
});

module.exports = router;