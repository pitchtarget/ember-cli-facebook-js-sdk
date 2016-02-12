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

* ember install ember-cli-facebook-js-sdk

## Usage and configuration

Before using the [Facebook SDK for Javascript](https://developers.facebook.com/docs/javascript) you need
to include it in your HTML. The more convenient way to do it is by using the addon service's FBInit method.
To do so, you must configure the parameters to use to initialize the Facebook SDK in your `config/environment.js` file in the `FB` key.
The following is a basic example of such a configuration:

```js
  FB = {
    appId: 'YOUR APP ID',
    version: 'v2.3',
    xfbml: true
  }
```

Note, if you use other addons or if you prefer to initialize the Facebook SDK for Javascript by your own, you must configure the addon to skip the initialization process:

```js
  FB = {
    skipInit: true
  }
```

Whenever you need to interact with Facebook SDK, you must inject the service in your code and use it as you would do with the
original SDK. Remember that async functions that would normally require a callback, here return a Promise.

If you find yourself, needing the service in all your controllers you could think of injecting the service by default in your controller like the following:

```js
export function initialize(application) {
  application.inject('controller', 'fb', 'service:fb');
}

export default {
  name: 'fb',
  initialize
};
```

## Exmaple app

You can find an example app which make use of the addon in the [I have been to repo](https://github.com/bugant/i-have-been-to).

## Running Tests

TODO: I need to find a way to run test with a valid (never expiring) access token for a test user.

* `ember test`
* `ember test --server`

## Building

* `ember build`

For more information on using ember-cli, visit [http://www.ember-cli.com/](http://www.ember-cli.com/).
