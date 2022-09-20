const axios = require('axios');

// Flickr API details
const options = {
    hostname: 'https://api.flickr.com',
    path: '/services/rest/?',
    method: 'flickr.photos.search',
    api_key: 'XXXX",
    format: 'json',
    media: 'photos',
    nojsoncallback: 1,
    number: 10
}

// Search Flickr for images based on query
async function searchFlickr(query) {
    return new Promise((resolve, reject) => {
        const url = options.hostname + options.path +
                    'method=' + options.method +
                    '&api_key=' + options.api_key +
                    '&tags=' + query +
                    '&per_page=' + options.number +
                    '&format=' + options.format +
                    '&media=' + options.media +
                    '&nojsoncallback=' + options.nojsoncallback;

        axios.get(url).then((response) => {
            // Return promise with JSON object containing, b_url, p_url, and photo title
            resolve(formatFlickrImagesURL(response.data))
        }).catch(error => {
            reject(error)
        })
    })
}
    
// Formet data from Flickr response and return JSON object
function formatFlickrImagesURL(data) {
    var photos = []
    for(i = 0; i < options.number; i++) {
        const photo = data.photos.photo[i];
        const b_url = "https://farm" + photo.farm + ".static.flickr.com/" + photo.server + "/" + photo.id + "_" + photo.secret + "_" + "b.jpg"
        const p_url = "https://www.flickr.com/photos/" + photo.owner + "/" + photo.id;
        const title = photo.title
        const json = {'b_url': b_url, 'p_url': p_url, 'title': title}
        photos[i] = json
    }
    return photos
}

module.exports.searchFlickr = searchFlickr;
