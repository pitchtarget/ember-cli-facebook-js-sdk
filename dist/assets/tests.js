define('dummy/tests/app.jshint', ['exports'], function (exports) {
  'use strict';

  QUnit.module('JSHint - .');
  QUnit.test('app.js should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'app.js should pass jshint.');
  });
});
define('dummy/tests/helpers/destroy-app', ['exports', 'ember'], function (exports, _ember) {
  exports['default'] = destroyApp;

  function destroyApp(application) {
    _ember['default'].run(application, 'destroy');
  }
});
define('dummy/tests/helpers/destroy-app.jshint', ['exports'], function (exports) {
  'use strict';

  QUnit.module('JSHint - helpers');
  QUnit.test('helpers/destroy-app.js should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'helpers/destroy-app.js should pass jshint.');
  });
});
define('dummy/tests/helpers/module-for-acceptance', ['exports', 'qunit', 'dummy/tests/helpers/start-app', 'dummy/tests/helpers/destroy-app'], function (exports, _qunit, _dummyTestsHelpersStartApp, _dummyTestsHelpersDestroyApp) {
  exports['default'] = function (name) {
    var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

    (0, _qunit.module)(name, {
      beforeEach: function beforeEach() {
        this.application = (0, _dummyTestsHelpersStartApp['default'])();

        if (options.beforeEach) {
          options.beforeEach.apply(this, arguments);
        }
      },

      afterEach: function afterEach() {
        (0, _dummyTestsHelpersDestroyApp['default'])(this.application);

        if (options.afterEach) {
          options.afterEach.apply(this, arguments);
        }
      }
    });
  };
});
define('dummy/tests/helpers/module-for-acceptance.jshint', ['exports'], function (exports) {
  'use strict';

  QUnit.module('JSHint - helpers');
  QUnit.test('helpers/module-for-acceptance.js should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'helpers/module-for-acceptance.js should pass jshint.');
  });
});
define('dummy/tests/helpers/resolver', ['exports', 'ember/resolver', 'dummy/config/environment'], function (exports, _emberResolver, _dummyConfigEnvironment) {

  var resolver = _emberResolver['default'].create();

  resolver.namespace = {
    modulePrefix: _dummyConfigEnvironment['default'].modulePrefix,
    podModulePrefix: _dummyConfigEnvironment['default'].podModulePrefix
  };

  exports['default'] = resolver;
});
define('dummy/tests/helpers/resolver.jshint', ['exports'], function (exports) {
  'use strict';

  QUnit.module('JSHint - helpers');
  QUnit.test('helpers/resolver.js should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'helpers/resolver.js should pass jshint.');
  });
});
define('dummy/tests/helpers/start-app', ['exports', 'ember', 'dummy/app', 'dummy/config/environment'], function (exports, _ember, _dummyApp, _dummyConfigEnvironment) {
  exports['default'] = startApp;

  function startApp(attrs) {
    var application = undefined;

    var attributes = _ember['default'].merge({}, _dummyConfigEnvironment['default'].APP);
    attributes = _ember['default'].merge(attributes, attrs); // use defaults, but you can override;

    _ember['default'].run(function () {
      application = _dummyApp['default'].create(attributes);
      application.setupForTesting();
      application.injectTestHelpers();
    });

    return application;
  }
});
define('dummy/tests/helpers/start-app.jshint', ['exports'], function (exports) {
  'use strict';

  QUnit.module('JSHint - helpers');
  QUnit.test('helpers/start-app.js should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'helpers/start-app.js should pass jshint.');
  });
});
define('dummy/tests/mirage/config.jshint', ['exports'], function (exports) {
  'use strict';

  QUnit.module('JSHint - mirage');
  QUnit.test('mirage/config.js should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(false, 'mirage/config.js should pass jshint.\nmirage/config.js: line 5, col 5, Forgotten \'debugger\' statement?\n\n1 error');
  });
});
define('dummy/tests/mirage/scenarios/default.jshint', ['exports'], function (exports) {
  'use strict';

  QUnit.module('JSHint - mirage/scenarios');
  QUnit.test('mirage/scenarios/default.js should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'mirage/scenarios/default.js should pass jshint.');
  });
});
define('dummy/tests/router.jshint', ['exports'], function (exports) {
  'use strict';

  QUnit.module('JSHint - .');
  QUnit.test('router.js should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'router.js should pass jshint.');
  });
});
define('dummy/tests/test-helper', ['exports', 'dummy/tests/helpers/resolver', 'ember-qunit'], function (exports, _dummyTestsHelpersResolver, _emberQunit) {

  (0, _emberQunit.setResolver)(_dummyTestsHelpersResolver['default']);
});
define('dummy/tests/test-helper.jshint', ['exports'], function (exports) {
  'use strict';

  QUnit.module('JSHint - .');
  QUnit.test('test-helper.js should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'test-helper.js should pass jshint.');
  });
});
define('dummy/tests/unit/services/fb-test', ['exports', 'ember-qunit', 'ember-getowner-polyfill', 'ember'], function (exports, _emberQunit, _emberGetownerPolyfill, _ember) {

  (0, _emberQunit.moduleFor)('service:fb', 'Unit | Service | fb', {
    beforeEach: function beforeEach() {
      var owner = (0, _emberGetownerPolyfill['default'])(this.subject());
      window.FB = undefined;
      owner.register('config:environment', _ember['default'].Object.create({
        FB: {
          appId: 'YOUR-APP-ID',
          version: 'v2.5'
        }
      }));

      this.subject().setAccessToken('YOUR-FB-TOKEN');
    }
  });

  (0, _emberQunit.test)('it exists', function (assert) {
    var service = this.subject();
    assert.ok(service);
  });

  (0, _emberQunit.test)('FBInit define FB on window', function (assert) {
    assert.expect(1);

    return this.subject().FBInit({
      appId: 'YOUR-APP-ID',
      version: 'v2.5'
    }).then(function () {
      assert.ok(window.FB);
    });
  });

  (0, _emberQunit.test)('fails with no app ID', function (assert) {
    assert.expect(1);

    var owner = (0, _emberGetownerPolyfill['default'])(this.subject());
    owner.register('config:environment', _ember['default'].Object.create());
    return this.subject().FBInit()['catch'](function (reason) {
      assert.ok(reason);
    });
  });

  (0, _emberQunit.test)('init get skipped', function (assert) {
    assert.expect(2);
    var subject = this.subject();
    var owner = (0, _emberGetownerPolyfill['default'])(subject);
    owner.register('config:environment', _ember['default'].Object.create({
      FB: {
        skipInit: true
      }
    }));

    subject.FBInit().then(function (response) {
      assert.ok(response);
      assert.equal(response, 'skip init');
    });
  });

  (0, _emberQunit.test)('get user data', function (assert) {
    assert.expect(1);

    return this.subject().api('/me').then(function (response) {
      assert.ok(response);
    });
  });

  (0, _emberQunit.test)('fail to fetch user data with a bad token', function (assert) {
    this.subject().setAccessToken('foo');
    assert.expect(1);

    return this.subject().api('/me').then(function () {
      assert.ok(false, "promise should not be fulfilled");
    })['catch'](function (reason) {
      assert.ok(reason);
    });
  });

  (0, _emberQunit.test)('getLoginStatus', function (assert) {
    assert.expect(1);
    var subject = this.subject();
    var owner = (0, _emberGetownerPolyfill['default'])(subject);
    owner.register('config:environment', _ember['default'].Object.create({
      FB: {
        skipInit: true
      }
    }));

    window.FB = {
      getLoginStatus: function getLoginStatus(f) {
        assert.ok('calls FB.getLoginStatus');
        f.call(window, 'OK');
      }
    };

    return subject.getLoginStatus();
  });

  (0, _emberQunit.test)('login', function (assert) {
    assert.expect(1);
    var subject = this.subject();
    var owner = (0, _emberGetownerPolyfill['default'])(subject);
    owner.register('config:environment', _ember['default'].Object.create({
      FB: {
        skipInit: true
      }
    }));

    window.FB = {
      login: function login(f) {
        assert.ok('calls FB.login');
        f.call(window, {
          authResponse: {
            accessToken: 'foo'
          }
        });
      }
    };

    return subject.login();
  });

  (0, _emberQunit.test)('login when it fails', function (assert) {
    assert.expect(2);
    var subject = this.subject();
    var owner = (0, _emberGetownerPolyfill['default'])(subject);
    owner.register('config:environment', _ember['default'].Object.create({
      FB: {
        skipInit: true
      }
    }));

    window.FB = {
      login: function login(f) {
        assert.ok('calls FB.login');
        f.call(window, 'foo');
      }
    };

    return subject.login()['catch'](function () {
      assert.ok('rejects');
    });
  });

  (0, _emberQunit.test)('logout', function (assert) {
    assert.expect(1);
    var subject = this.subject();
    var owner = (0, _emberGetownerPolyfill['default'])(subject);
    owner.register('config:environment', _ember['default'].Object.create({
      FB: {
        skipInit: true
      }
    }));

    window.FB = {
      logout: function logout(f) {
        assert.ok('calls FB.logout');
        f.call(window, 'OK');
      }
    };

    return subject.logout();
  });

  (0, _emberQunit.test)('getAuthResponse', function (assert) {
    assert.expect(1);
    var subject = this.subject();
    var owner = (0, _emberGetownerPolyfill['default'])(subject);
    owner.register('config:environment', _ember['default'].Object.create({
      FB: {
        skipInit: true
      }
    }));

    window.FB = {
      getAuthResponse: function getAuthResponse() {
        assert.ok('calls FB.getAuthResponse');
      }
    };

    subject.getAuthResponse();
  });
});
define('dummy/tests/unit/services/fb-test.jshint', ['exports'], function (exports) {
  'use strict';

  QUnit.module('JSHint - unit/services');
  QUnit.test('unit/services/fb-test.js should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/services/fb-test.js should pass jshint.');
  });
});
/* jshint ignore:start */

require('dummy/tests/test-helper');
EmberENV.TESTS_FILE_LOADED = true;

/* jshint ignore:end */
//# sourceMappingURL=tests.map