# Ember-cli-facebook-js-sdk

Simple Facebook SDK for Javascript addon for your Ember CLI app.

This addon lets you interact with the Facebook API using Promises
as you would usually do with any async operation in your Ember app.
The same API is used in the addon so that you can easily refer to the
[Facebook SDK for Javascript reference doc](https://developers.facebook.com/docs/javascript/reference) for
details on the usage.

The methods implemented are:

* Core Methods
  - init
  - api
  - ui
* Facebook Login Methods
  - getLoginStatus
  - login
  - logout
  - getAuthResponse

## Installation

* `npm install ember-cli-facebook-js-sdk --save-dev`

## Usage

Before using the [Facebook SDK for Javascript](https://developers.facebook.com/docs/javascript) you need
to include it in your HTML. The more convenient way to do this in your Ember app is to create an initializer
that do it.

```js
import FB from 'ember-cli-facebook-js-sdk/fb';

export default {
  name: 'fb',
  initialize: function() {
    return FB.init({
      appId: 'YOUR APP ID',
      version: 'v2.3',
      xfbml: true
    });
  }
};
```

Whenever you need to interact with Facebook SDK, include the FB module and use it as you would do with the
original SDK. Remember that async functions that would normally require a callback, here return a Promise.

## Running Tests

TODO: I need to find a way to run test with a valid (never expiring) access token for a test user.

* `ember test`
* `ember test --server`

## Building

* `ember build`

For more information on using ember-cli, visit [http://www.ember-cli.com/](http://www.ember-cli.com/).
