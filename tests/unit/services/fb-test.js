import { moduleFor, test } from 'ember-qunit';
import Ember from 'ember';

const fbAppId = '1565218020393850';
const fbAccessToken = 'EAAWPjrgaA3oBACymCMWIFlbLxy4Xbw1ZAQg3ApKwudSE1EXu95fxla0FOEQRxDm8IYZBiFNZBq9C1aytoTnpUXCsUnaYL594xl8yFhap1pmlfNbkHPerPFI8c8YLMquc92e5br7qIdCgmgumBzTu0PDnbWij6Bzs7vtaMWGNbeAGhXb893zc1k2Q2g32IaPVBRn4xn8igZDZD';

moduleFor('service:fb', 'Unit | Service | fb', {
  beforeEach() {
    let owner = Ember.getOwner(this.subject());
    window.FB = undefined;
    owner.register('config:environment', Ember.Object.create({
      FB: {
        appId: fbAppId,
        version: 'v2.10'
      }
    }));

    this.subject().setAccessToken(fbAccessToken);
  }
});

test('it exists', function(assert) {
  let service = this.subject();
  assert.ok(service);
});

test('FBInit define FB on window', function(assert) {
  assert.expect(1);

  return this.subject().FBInit({
    appId: fbAppId,
    version: 'v2.10'
  }).then(function() {
    assert.ok(window.FB);
  });
});

test('FBInit loads localized version', function(assert) {
  assert.expect(2);

  return this.subject().FBInit({
    appId: fbAppId,
    version: 'v2.10',
    locale: 'es_ES'
  }).then(() => {
    assert.equal(this.subject().locale, 'es_ES', 'locale is localized');
    assert.ok(window.FB);
  });
});

test('fails with no app ID', function(assert) {
  assert.expect(1);

  let owner = Ember.getOwner(this.subject());
  owner.register('config:environment', Ember.Object.create());
  return this.subject().FBInit().catch(function(reason) {
    assert.ok(reason);
  });
});

test('init get skipped', function(assert) {
  assert.expect(2);
  let subject = this.subject();
  let owner = Ember.getOwner(subject);
  owner.register('config:environment', Ember.Object.create({
    FB: {
      skipInit: true
    }
  }));

  subject.FBInit().then(function(response) {
    assert.ok(response);
    assert.equal(response, 'skip init');
  });
});

test('get user data', function(assert) {
  assert.expect(1);

  return this.subject().api('/me').then(function(response) {
    assert.ok(response);
  });
});

test('fail to fetch user data with a bad token', function(assert) {
  this.subject().setAccessToken('foo');
  this.subject().refreshToken = false;
  assert.expect(1);

  return this.subject().api('/me').then(function() {
    assert.ok(false, "promise should not be fulfilled");
  }).catch(function(reason) {
    assert.ok(reason);
  });
});

test('getLoginStatus', function(assert) {
  assert.expect(1);
  let subject = this.subject();
  let owner = Ember.getOwner(subject);
  owner.register('config:environment', Ember.Object.create({
    FB: {
      skipInit: true
    }
  }));

  window.FB = {
    getLoginStatus(f) {
      assert.ok('calls FB.getLoginStatus');
      f.call(window, 'OK');
    }
  };

  return subject.getLoginStatus();
});

test('login', function(assert) {
  assert.expect(2);
  let subject = this.subject();
  let owner = Ember.getOwner(subject);
  owner.register('config:environment', Ember.Object.create({
    FB: {
      skipInit: true
    }
  }));

  const fakeResp = {
    authResponse: {
      accessToken: 'foo'
    }
  };
  window.FB = {
    login(f) {
      assert.ok('calls FB.login');
      f.call(window, fakeResp);
    }
  };

  return subject.login().then(function(result) {
    assert.equal(fakeResp, result, 'returns the Facebook response');
  });
});

test('login when it fails', function(assert) {
  assert.expect(2);
  let subject = this.subject();
  let owner = Ember.getOwner(subject);
  owner.register('config:environment', Ember.Object.create({
    FB: {
      skipInit: true
    }
  }));

  window.FB = {
    login(f) {
      assert.ok('calls FB.login');
      f.call(window, 'foo');
    }
  };

  return subject.login().catch(() => {
    assert.ok('rejects');
  });
});

test('logout', function(assert) {
  assert.expect(1);
  let subject = this.subject();
  let owner = Ember.getOwner(subject);
  owner.register('config:environment', Ember.Object.create({
    FB: {
      skipInit: true
    }
  }));

  window.FB = {
    logout(f) {
      assert.ok('calls FB.logout');
      f.call(window, 'OK');
    }
  };

  return subject.logout();
});

test('getAuthResponse', function(assert) {
  assert.expect(1);
  let subject = this.subject();
  let owner = Ember.getOwner(subject);
  owner.register('config:environment', Ember.Object.create({
    FB: {
      skipInit: true
    }
  }));

  window.FB = {
    getAuthResponse() {
      assert.ok('calls FB.getAuthResponse');
    }
  };

  subject.getAuthResponse();
});
