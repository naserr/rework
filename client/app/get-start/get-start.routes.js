'use strict';

export default function($stateProvider) {
  'ngInject';
  $stateProvider
    .state('getStart', {
      url: '/start',
      authenticate: true,
      template: '<get-start></get-start>'
    });
}
