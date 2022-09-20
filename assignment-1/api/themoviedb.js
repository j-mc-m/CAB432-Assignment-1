const axios = require('axios');

// The Movie Database API details
const options = {
    hostname: 'https://api.themoviedb.org',
    api_key: 'XXXX',
    adult: 'false',
    path: '/3/search/movie'
}

// Search The Movie Database for movie titles based on query
async function searchTheMovieDB(query) {
    return new Promise((resolve, reject) => {
        const encodedQuery = encodeURIComponent(query);
        const url = options.hostname + options.path +
                '?api_key=' + options.api_key +
                '&include_adult=' + options.adult +
                '&query=' + encodedQuery;
        axios.get(url).then((response) => {
            resolve(response.data)
        }).catch(error => {
            reject(error)
        })
    })
}

module.exports.searchTheMovieDB = searchTheMovieDB;
