import { test } from 'ember-qunit';
import { module } from 'qunit';
import FB from 'ember-cli-facebook-js-sdk/fb';

module('FB: init');

test('define FB on window', function(assert) {
  assert.expect(1);
  var done = assert.async();

  FB.init({
    appId: '1565218020393850',
    version: 'v2.2'
  }).then(function() {
    assert.ok(window.FB);
    done();
  });
});

test('fails with no app ID', function(assert) {
  assert.expect(1);
  var done = assert.async();

  FB.init().catch(function(reason) {
    assert.ok(reason);
    done();
  });
});
