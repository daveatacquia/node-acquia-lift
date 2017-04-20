/*!
 * make a signed request
 */

'use strict';

/**
 * Module dependencies.
 */

const request = require('request');
const hmac = require('./hmac')
const querystring = require("querystring");

/**
 * Expose `signedRequest()`.
 */

exports = module.exports = signedRequest;

/**
 * Takes a params object with all request parameters, makes the signed request
 * and then returns the response in the "request" module format of error, response, body
 */
function signedRequest(params, callback, debug = false) {
  // get the initial hmac headers
  var headers = hmac(params)

  // additional headers required if sending a post request with body
  if(params.body) {
    headers = Object.assign(headers, {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(params.body)
    })
  }

  var processedurl = "https://" + params.hostname + params.path
  if(params.queryparams) processedurl += "?" + params.queryparams

  // make the actual request
  var options = {
    url: processedurl,
    method: params.method,
    body: params.body,
    headers: headers
  };

  if(debug) {
    console.log(options)
  } else {
    request(options, function(error, response, body) {
      callback(error, response, body)
    });
  }
}
