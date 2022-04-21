const request = require('request');
const config = require('./config');

const url = config.url;

function requestApi (api, data, callback) {
  request({
    uri: url + api,
    method: "POST",
    body: data,
    json: true
  }, function (err, res, body) {
    //do somethings
    callback(err, res, body)
  });  
}

module.exports = requestApi