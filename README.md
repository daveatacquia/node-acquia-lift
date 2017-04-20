# Acquia Lift Node Library

This node.js module currently handles hmac authentication and includes a simple wrapper for making a request to Lift endpoints

## Installation

```
npm install acquia-lift
```

## Example requests

All requests will use a similar format. Simply pass in the `params` object into the signedRequest function. Different requests take different parameters, so be sure to consult the [API docs](https://docs.acquia.com/lift/omni/api)

All of the following example request scripts begin with the following:
```
'use strict';

const signedRequest = require('acquia-lift').signedRequest

// These will always be specific to your environment
var account_id = '<your Lift account_id>'
var site_id = '<your Lift site_id>'
var apikey = '<your Lift api key>'
var secretkey = '<your Lift secret key>'
```

### Profile Manager Capture
Based on [Capture API Docs](http://docs.lift.acquia.com/profilemanager/#capture_post)

```
var inputBody =  {
	"identity": "dave@acquia.com",
	"identity_source": "email",
	"return_segments": true,
	"site_id": site_id,
	"captures": [{
		"event_name": "Content View",
		"event_source": "web",
		"event_date": "2017-04-16T00:11:00.000Z",
		"url": "http://www.example.com",
		"referral_url": "http://www.google.com",
		"content_title": "Hello World!",
		"site_id": site_id,
		"engagement_score": 10,
		"identities": {
			"dave@acquia.com": "email"
		}
	}]
}

var params = {
  "hostname" : "api-liftweb-us1.lift.acquia.com",
  "apikey" : apikey,
  "secretkey" : secretkey,
  "method" : "POST",
  "path" : "/" + account_id + "/capture",
  "queryparams" : null,
  "additionalHeaders" : null,
  "body" : JSON.stringify(inputBody)
}

signedRequest(params, function(error, response, body) {
  if (!error && response.statusCode == 200 || response.statusCode == 201) {
    console.log(response.statusCode)
    console.log(JSON.parse(body))
  }
  else {
    console.log(response.statusCode)
    console.log(body)
  }
});
```

## Profile Manager Visitor Query
Based on [Visitor Query API Docs](http://docs.lift.acquia.com/profilemanager/#visitor_query_get)

```
var params = {
  "hostname" : "api-liftweb-us1.lift.acquia.com",
  "apikey" : apikey,
  "secretkey" : secretkey,
  "method" : "GET",
  "path" : "/" + account_id + "/visitor_query",
  "queryparams" : "identifier=dave@acquia.com&identifierType=email&personTables=person"
}

signedRequest(params, function(error, response, body) {
  // handle response
});
```

## Decision API Create Slot
Based on [Create Slot API Docs](http://docs.decision-api.acquia.com/#slots_post)

```
var params = {
  'hostname' : 'us-east-1-decisionapi.lift.acquia.com',
  'apikey' : apikey,
  'secretkey' : secretkey,
  'method' : 'POST',
  'path' : '/slots',
  'queryparams' : "account_id=" + account_id + '&' + 'site_id=' + site_id,
  'body' : JSON.stringify({
    "id": "slot-2",
    "label": "Slot 2",
    "description": "Acquia Lift Slot 2.",
    "html": "",
    "status": "enabled",
    "visibility": {
      "pages": [
        "localhost/blog/*"
      ],
      "condition": "show"
    }
  })
}

signedRequest(params, function(error, response, body) {
  // handle response
});
```
