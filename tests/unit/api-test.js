import { test } from 'ember-qunit';
import { module } from 'qunit';
import FB from 'ember-cli-facebook-js-sdk/fb';

module('FB: api', {
  beforeEach: function(assert) {
    FB.init({
      appId: 'APP ID',
      version: 'v2.2'
    });
    FB.loginWith('YOUR ACCESS TOKEN');
  }
});

test('get user data', function(assert) {
  assert.expect(1);
  var done = assert.async();

  FB.api('/me').then(function(response) {
    assert.ok(response);
    done();
  });
});

test('fail to fetch user data with a bad token', function(assert) {
  assert.expect(1);
  FB.loginWith('foo');
  var done = assert.async();

  FB.api('/me').catch(function(reason) {
    assert.ok(reason);
    done();
  });
});
