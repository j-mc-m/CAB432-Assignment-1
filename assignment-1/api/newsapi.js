const axios = require('axios');

// NewsAPI details
const options = {
    api_key: 'XXXX',
    hostname: 'https://newsapi.org',
    path: '/v2/everything',
    page_size: 10
}

// Search NewsAPI for articles based on query
async function searchNewsAPI(query) {
    return new Promise((resolve, reject) => {
        const encodedQuery = encodeURIComponent(query)
        const url = options.hostname + options.path +
                    '?q=' + encodedQuery +
                    '&pageSize=' + options.page_size + 
                    '&apiKey=' + options.api_key;
        axios.get(url).then((response) => {
            resolve(response.data)
        }).catch(error => {
            reject(error)
        })
    })
}

module.exports.searchNewsAPI = searchNewsAPI;
