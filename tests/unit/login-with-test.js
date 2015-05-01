import { test } from 'ember-qunit';
import { module } from 'qunit';
import FB from 'ember-cli-facebook-js-sdk/fb';

module('FB: loginWith');

test('set the Facebook access token', function(assert) {
  assert.expect(1);
  FB.loginWith('foo');
  assert.equal('foo', FB.accessToken);
});
