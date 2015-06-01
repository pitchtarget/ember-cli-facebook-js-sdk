import FB from 'ember-cli-facebook-js-sdk/fb';

export default {
  name: 'fb',
  initialize: function(container, application) {
    FB.init({
      appId: '1565218020393850',
      version: 'v2.3',
      xfbml: true
    });
  }
};
