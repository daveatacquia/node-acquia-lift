/*!
 * acquia hmac
 * see https://github.com/acquia/http-hmac-spec
 */

'use strict';

/**
 * Module dependencies.
 */

const crypto = require('crypto')
const querystring = require("querystring");

/**
 * Expose `createAcquiaHmac()`.
 */

exports = module.exports = createAcquiaHmac;

/**
 * Create HTTP headers for an Acquia HTTP Hmac request.
 *
 * @return {Function}
 * @api public
 */
function createAcquiaHmac(params) {
  // set some parameters if not passed in
  var defaults = {
    'timestamp' : Math.floor(Date.now() / 1000),
    'nonce' : generateNonce(),
    'realm' : "Acquia",
    'version' : "2.0",
    'contentType' : 'application/json'
  }
  params = Object.assign(defaults, params)

  var signature = sign(params)
  var authorization = authorize(params, signature)
  var bodyHash = hashBody(params.body)

  var headers = {
    "Authorization" : authorization,
    "X-Authorization-Timestamp" : params.timestamp
  }

  if(params.body) {
    headers["X-Authorization-Content-SHA256"] = bodyHash
    headers["Content-Type"] = params.contentType,
    headers["Content-Length"] = Buffer.byteLength(params.body)
  }

  return headers;
}

/**
* Make the signature
*/
const sign = function(params) {
  var authorizationHeaderParameters = "id=" + querystring.escape(params.apikey) + "&" +
     "nonce=" + querystring.escape(params.nonce) + "&" +
     "realm=" + querystring.escape(params.realm) + "&" +
     "version=" + querystring.escape(params.version)

  var stringToSign = params.method + "\n" + params.hostname + "\n" + params.path + "\n"

  if(params.queryparams) {
    stringToSign += params.queryparams
  }

  stringToSign += "\n" + authorizationHeaderParameters + "\n"

  // @TODO still have to do extra stuff here like lowercase and sort
  // if(params.additionalHeaders) {
  //   stringToSign += params.additionalHeaders
  // }

  stringToSign += params.timestamp

  if(params.body) { // content-length > 0 .. needed beyond get request
    stringToSign += "\n" + params.contentType
    stringToSign += "\n" + hashBody(params.body)
  }

  // decode secretkey
  var decodedSecret = Buffer.from(params.secretkey, 'base64');

  var hmacSignature = crypto.createHmac('sha256', decodedSecret)
                     .update(stringToSign)
                     .digest('base64');

  return hmacSignature
}

/**
 * Now use Signature to create Authorization
 */
const authorize = function(params, signature) {
  return "acquia-http-hmac" + " " +
        'realm="' + querystring.escape(params.realm) + '",' +
        'id="' + querystring.escape(params.apikey) + '",' +
        'nonce="' + querystring.escape(params.nonce) + '",' +
        'version="' + querystring.escape(params.version) + '",' +
        //'headers="' + AdditionalSignedHeaderNames + "," + (only if they exist)
        'signature="' + signature + '"'
}

/**
 * Create the SHA256 hash of the body
 */
const hashBody = function(body) {
  if(!body) return null

  const hash = crypto.createHash('sha256');
  hash.update(body);
  return hash.digest('base64');
}

/**
 * Generate a UUID for the nonce
 */
var generateNonce = function generateNonce() {
  var d = Date.now();
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = (d + Math.random() * 16) % 16 | 0;
      d = Math.floor(d / 16);
      return (c == 'x' ? r : r & 0x7 | 0x8).toString(16);
    });
};
