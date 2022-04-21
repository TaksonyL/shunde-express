const request = require('request');
const config = require('./../config');

const url = config.url;

function requestApi (api, data, callback) {
  return new Promise((resolve, reject) => {
    request({
      uri: url + api,
      method: "POST",
      body: data,
      json: true
    }, function (err, res, body) {
      //do somethings
      if(body.code === 1 || body.code === 0) {
        resolve(body.data);
      } else {
        console.log(data, body);
        resolve([]);
      }
    });   
  })
}

module.exports = requestApi