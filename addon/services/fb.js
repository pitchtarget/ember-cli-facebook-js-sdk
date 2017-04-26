import Ember from 'ember';

export default Ember.Service.extend(Ember.Evented, {
  fbInitPromise: null,
  locale: null,

  FBInit() {
    if (this.fbInitPromise) { return this.fbInitPromise; }

    const ENV = Ember.getOwner(this).resolveRegistration('config:environment');

    // Detect language configuration and store it.
    const locale = ENV.FB.locale || 'en_US';
    this.locale = locale;

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
      // URL for the SDK is built according to locale. Defaults to `en_US`.
      Ember.$.getScript(`https://connect.facebook.net/${locale}/sdk.js`, function() {
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
    this.trigger('fb.setAccessToken', token);
    return token;
  },

  loginWith: function(token) {
    console.warn('DEPRECATED: please, use setAccessToken instead');
    this.setAccessToken(token);
  },

  _api(path) {
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

  api() {
    return this._api(...arguments).catch((error) => {
      if (error.code === 190) {
        console.debug('Trying to refresh Facebook session an re-do the Facebook API request');
        return this.getLoginStatus().then((response) => {
          if (response.status === 'connected') {
            this.setAccessToken(response.authResponse.accessToken);
            return this._api(...arguments);
          }
          return Ember.RSVP.reject(response);
        });
      }
      return Ember.RSVP.reject(error);
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
