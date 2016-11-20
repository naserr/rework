'use strict';

export default function($stateProvider) {
  'ngInject';
  $stateProvider
    .state('projectTools', {
      url: '/projectTools',
      authenticate: true,
      template: require('./projectTools.html')
    });
}
