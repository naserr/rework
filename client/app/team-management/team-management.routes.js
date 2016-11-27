'use strict';

export default function ($stateProvider) {
  'ngInject';
  $stateProvider
    .state('teammanagement', {
      url: '/teammanagement',
      authenticate: true,
      template: require('./team-management.html'),
    });
}
