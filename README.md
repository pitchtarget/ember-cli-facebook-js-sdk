[![Ember Observer Score](http://emberobserver.com/badges/ember-cli-facebook-js-sdk.svg)](http://emberobserver.com/addons/ember-cli-facebook-js-sdk)

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
* Misc
  - XFBML.parse

## Installation

* `ember install ember-cli-facebook-js-sdk`

### Upgrade from 0.0.4

From version 1.0.0 ember-cli-facebook-js-sdk implements a service, before it was a simple ES6 module you should import.
If you prefer to stick to the old version, checkout the [0.0.4 tag](https://github.com/pitchtarget/ember-cli-facebook-js-sdk/tree/0.0.4).

## Usage and configuration

### Configuration

Before using the [Facebook SDK for Javascript](https://developers.facebook.com/docs/javascript) you need
to include it in your HTML. The more convenient way to do it is by using the addon service's FBInit method.
To do so, you must configure the parameters to use to initialize the Facebook SDK in your `config/environment.js` file in the `FB` key.
The following is a basic example of such a configuration:

```js
  FB = {
    appId: 'YOUR APP ID',
    version: 'v2.10',
    xfbml: true
  }
```

You need to replace **YOUR APP ID** with your own Facebook App ID (which can be found in the Facebook developer dashboard)
and also set the **version** to Facebook API version you would like to use.

### Skipping Facebook SDK init

Note, if you use other addons or if you prefer to initialize the Facebook SDK for Javascript by your own, you must configure the addon to skip the initialization process:

```js
  FB = {
    skipInit: true
  }
```

### Usage

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

### Initialize the Facebook JS SDK

Before using the Facebook SDK you must be sure to have initialized it.
The most convenient way is to call the `FBInit` function of the `fb`
service in your `Application` route:

```js
import Ember from 'ember';

export default Ember.Route.extend({
  fb: Ember.inject.service(),

  beforeModel() {
    return this.get('fb').FBInit();
  }
})
```

### Authorization

When creating your own authorization flow, supply `fb.login()` with a space delimited string of the permissions that your app requires.

```js
import Ember from 'ember';

export default Ember.Controller.extend({
  fb: Ember.inject.service(),

  actions: {
    onClick() {
      this.get('fb').login('email public_profile').then(function() {
        ...
      });
    }
  }
});
```

If you need to supply additional options, pass them after the scope. For example, to request that your app can make public posts on behalf of the user, pass `default_audience: 'everyone'` as an option. Check the [docs](https://developers.facebook.com/docs/reference/javascript/FB.login/v2.10) for details.

```js
import Ember from 'ember';

export default Ember.Controller.extend({
  fb: Ember.inject.service(),

  actions: {
    onClick() {
      this.get('fb').login('email public_profile', { default_audience: 'everyone' }).then(function() {
        ...
      });
    }
  }
});
```

### Usage example

You can now use the add-on to, for example, retrieve the current Facebook user data from your route:

```js
import Ember from 'ember';

export default Ember.Route.extend({
  fb: Ember.inject.service(),

  model() {
    return this.get('fb').api('/me');
  }
});
```

### Forcing XFBML tag re-parsing

The loading and initialization of the Facebook SDK is asynchronous so it may happen that you use XFBML tags and these
are not properly parsed from the SDK: this could happen, for example, because you add such a tag as part of a component
mark-up which is added to the DOM after the parsing init script already run. In such a case you may find it useful to rescue
to call the [xfbml_parse](https://developers.facebook.com/docs/reference/javascript/FB.XFBML.parse) function explicitly:

```js
import Ember from 'ember';

export default Ember.Component.extend({
  fb: Ember.inject.service(),

  didInsertElement() {
    return this.get('fb').xfbml_parse();
  }
});
```

You may also try to schedule the same code to run `afterRender` from your route's `controller` hook.

## Example app

You can find an example app which make use of the addon in the [I have been to repo](https://github.com/bugant/i-have-been-to).

## Running Tests

TODO: I need to find a way to run test with a valid (never expiring) access token for a test user.
Before running tests, you need to set a valid Facebook access token for a test user of our test app. If you have no access to the Facebook test App, use one of your own.

* `ember test`
* `ember test --server`

## Building

* `ember build`

For more information on using ember-cli, visit [http://www.ember-cli.com/](http://www.ember-cli.com/).
