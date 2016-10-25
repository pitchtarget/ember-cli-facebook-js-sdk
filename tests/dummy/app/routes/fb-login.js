import Ember from 'ember';

export default Ember.Route.extend({
  fb: Ember.inject.service(),

  setupController() {
    this._super(...arguments);
    this.get('fb').xfbml_parse();
  }
});
