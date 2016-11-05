'use strict';

export default function($stateProvider) {
  'ngInject';
  $stateProvider
    .state('app.getStart', {
      url: 'getStart',
      authenticate: true,
      views: {
        'header@': {
          template: ''
        },
        'sidebar@': {
          template: ''
        },
        '@': {
          template: '<get-start></get-start>'
        }
      }
    });
}
