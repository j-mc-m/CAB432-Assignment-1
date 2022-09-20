// AWS configuration
const AWS = require('aws-sdk');
const { get } = require('../routes');
AWS.config.update({region: 'ap-southeast-2'});
AWS.config.loadFromPath('./config.json');
s3 = new AWS.S3({apiVersion: '2006-03-01'})

// Bucket and object names
const s3Bucket = "n10467009-s3-count";
const s3Object = "s3-count";

// Site counter object
const s3Count = {
    count: 0
}

// Criteria-adherent (?) workaround to issues returning data from S3 bucket and displaying as variable
let count = 0;

function getCount() {
    return count;
}

var newDeployment = true

// Update the local variable page count and update on S3
function s3UpdateCounter() {
    if(newDeployment) {
        newCount = s3Count
        newCount.count++
        const body = JSON.stringify(newCount)
        // Update S3 object
        s3.putObject({Bucket: s3Bucket, Key: s3Object, Body: body}, function(err, data) {
            if(err) {
                console.log(err.message)
            } else {
                console.log("Successfully updated page counter on S3")
                newDeployment = false
            }
        }) 
    } else {
        s3.getObject({Bucket: s3Bucket, Key: s3Object}, (err, result) => {
            if(result) {
                const resultJSON = JSON.parse(result.Body)
                const newResultJSON = resultJSON
                newResultJSON.count++
                const body = JSON.stringify(newResultJSON)

                // Update S3 object
                s3.putObject({Bucket: s3Bucket, Key: s3Object, Body: body}, function(err, data) {
                    if(err) {
                        console.log(err.message)
                    } else {
                        count = newResultJSON.count
                        console.log("Successfully updated new page counter on S3")
                    }
                })
            }
        })   
    }
}

module.exports.s3UpdateCounter = s3UpdateCounter
module.exports.getCount = getCount