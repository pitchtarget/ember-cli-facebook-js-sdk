import Ember from 'ember';
import getOwner from 'ember-getowner-polyfill';

export default Ember.Service.extend({
  fbInitPromise: null,

  FBInit() {
    if (this.fbInitPromise) { return this.fbInitPromise; }

    const ENV = getOwner(this)._lookupFactory('config:environment');

    if (ENV.FB && ENV.FB.skipInit) {
      this.fbInitPromise = Ember.RSVP.Promise.resolve('skip init');
      return this.fbInitPromise;
    }

    var original = window.fbAsyncInit;
    var initSettings = ENV.FB;
    if (!initSettings || !initSettings.appId || !initSettings.version) {
      return Ember.RSVP.reject('No settings for init');
    }

    this.fbInitPromise = new Ember.RSVP.Promise(function(resolve){
      window.fbAsyncInit = function() {
        window.FB.init(initSettings);
        Ember.run(null, resolve);
      };
      Ember.$.getScript('//connect.facebook.net/en_US/sdk.js', function() {
        // Do nothing here, wait for window.fbAsyncInit to be called.
      });
    }).then(function() {
      if (original) {
        window.fbAsyncInit = original;
        window.fbAsyncInit();
        window.fbAsyncInit.hasRun = true;
      }
    });

    return this.fbInitPromise;
  },

  setAccessToken(token) {
    this.accessToken = token;
    return token;
  },

  loginWith: function(token) {
    console.warn('DEPRECATED: please, use setAccessToken instead');
    this.setAccessToken(token);
  },

  api(path, method = 'GET', parameters = {}) {
    if (!path) { return Ember.RSVP.reject('Please, provide a path for your request'); }

    parameters = Ember.$.extend(parameters, {access_token: this.accessToken});

    return this.FBInit().then(function() {
      return new Ember.RSVP.Promise(function(resolve, reject) {
        window.FB.api(path, method, parameters, function(response) {
          if (response.error) {
            Ember.run(null, reject, response.error);
            return;
          }

          Ember.run(null, resolve, response);
        });
      });
    });
  },

  ui: function(params) {
    return this.FBInit().then(function() {
      return new Ember.RSVP.Promise(function(resolve, reject) {
        window.FB.ui(params, function(response) {
          if (response && !response.error_code) {
            Ember.run(null, resolve, response);
            return;
          }

          Ember.run(null, reject, response);
        });
      });
    });
  },

  // Facebook Login Methods

  getLoginStatus: function(forceRequest) {
    return this.FBInit().then(function() {
      return new Ember.RSVP.Promise(function(resolve) {
        window.FB.getLoginStatus(function(response) {
          Ember.run(null, resolve, response);
        }, forceRequest);
      });
    });
  },

  login: function(scope) {
    var service = this;
    return this.FBInit().then(function() {
      return new Ember.RSVP.Promise(function(resolve, reject) {
        window.FB.login(function(response) {
          if (response.authResponse) {
            service.accessToken = response.authResponse.accessToken;
            Ember.run(null, resolve, response);
          } else {
            Ember.run(null, reject, response);
          }
        }, {scope: scope});
      });
    });
  },

  logout: function() {
    return this.FBInit().then(function() {
      return new Ember.RSVP.Promise(function(resolve) {
        window.FB.logout(function(response) {
          Ember.run(null, resolve, response);
        });
      });
    });
  },

  getAuthResponse: function() {
    return window.FB.getAuthResponse();
  },

  xfbml_parse: function() {
    return this.FBInit().then(function() {
      return new Ember.RSVP.Promise(function(resolve) {
        return window.FB.XFBML.parse(undefined, function() {
          Ember.run(null, resolve, 'XFBML.parse');
        });
      });
    });
  }
});
