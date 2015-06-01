import Ember from 'ember';

var fb = {
  fbInitPromise: null,

  // Core Methods

  init: function(settings) {
    this.fbInitSettings = this.fbInitSettings || settings;
    if (this.fbInitPromise) { return this.fbInitPromise; }

    var original = window.fbAsyncInit;
    var initSettings = this.fbInitSettings;
    if (!initSettings || !initSettings.appId || !initSettings.version) {
      return Ember.RSVP.reject('No settings for init');
    }

    this.fbInitPromise = new Ember.RSVP.Promise(function(resolve){
      window.fbAsyncInit = function() {
        window.FB.init(initSettings);
        Ember.run(null, resolve);
      };
      Ember.$.getScript('//connect.facebook.net/en_US/sdk.js');
    }).then(function() {
      if (original) {
        window.fbAsyncInit = original;
        window.fbAsyncInit();
        window.fbAsyncInit.hasRun = true;
      }
    });

    return this.fbInitPromise;
  },

  api: function(path) {
    var method = 'GET';
    var parameters = {};
    var arg;

    if (!path) { return Ember.RSVP.reject('Please, provide a path for your request'); }

    switch (arguments.length) {
      case 2:
        arg = arguments[1];
        if (typeof arg === 'string') {
          method = arg;
        } else {
          parameters = arg;
        }
        break;
      case 3:
        method = arguments[1];
        parameters = arguments[2];
    }

    parameters = Ember.$.extend(parameters, {access_token: this.accessToken});

    return this.init().then(function() {
      return new Ember.RSVP.Promise(function(resolve, reject) {
        FB.api(path, method, parameters, function(response) {
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
    return this.init().then(function() {
      return new Ember.RSVP.Promise(function(resolve, reject) {
        FB.ui(params, function(response) {
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
    return this.init().then(function() {
      return new Ember.RSVP.Promise(function(resolve) {
        FB.getLoginStatus(function(response) {
          Ember.run(null, resolve, response);
        }, forceRequest);
      });
    });
  },

  login: function(scope) {
    var fb = this;
    return this.init().then(function() {
      return new Ember.RSVP.Promise(function(resolve, reject) {
        FB.login(function(response) {
          if (response.authResponse) {
            fb.accessToken = response.authResponse.accessToken;
            Ember.run(null, resolve, response);
          } else {
            Ember.run(null, reject, response);
          }
        }, {scope: scope});
      });
    });
  },

  loginWith: function(token) {
    this.accessToken= token;
    return token;
  },

  logout: function() {
    return this.init().then(function() {
      return new Ember.RSVP.Promise(function(resolve) {
        FB.logout(function(response) {
          Ember.run(null, resolve, response);
        });
      });
    });
  },

  getAuthResponse: function() {
    return FB.getAuthResponse();
  }
};

export default fb;
