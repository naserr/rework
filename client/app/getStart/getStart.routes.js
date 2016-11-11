'use strict';

export default function($stateProvider) {
  'ngInject';
  $stateProvider
    .state('getStart', {
      url: '/getStart',
      authenticate: true,
      template: '<get-start></get-start>'
    });
}
