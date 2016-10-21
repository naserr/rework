'use strict';

export default function routes($stateProvider) {
  'ngInject';

  $stateProvider
    .state('app.test', {
      url: 'test',
      authenticate: true,
      views: {
        '@': {
          template: '<h1>Test</h1><a ui-sref="app.main">main</a>'
        }
      }
    });
}
