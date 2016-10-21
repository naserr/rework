'use strict';

export default function routes($stateProvider) {
  'ngInject';

  $stateProvider
    .state('app.main', {
      url: '',
      authenticate: true,
      views: {
        '@': {
          template: '<h1>Main</h1><a ui-sref="app.test">test</a>'
        }
      }
    });
}
