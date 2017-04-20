# Acquia Lift Node Library

This node.js module currently handles hmac authentication and includes a simple wrapper for making a request to Lift endpoints

## Installation

```
npm install acquia-lift
```

## Example requests

All requests will use a similar format. Simply pass in the `params` object into the signedRequest function. Different requests take different parameters, so be sure to consult the [API docs](https://docs.acquia.com/lift/omni/api)
