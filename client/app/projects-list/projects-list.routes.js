'use strict';

export default function($stateProvider) {
  'ngInject';
  $stateProvider
    .state('projects', {
      url: '/projects',
      abstract: true,
      authenticate: true,
      template: '<div ui-view></div>',
      resolve: {
        /*@ngInject*/
        projects: $http => $http.get('/api/projects/me')
      }
    })
    .state('projects.list', {
      url: '/list',
      authenticate: true,
      template: '<projects-list projects="$resolve.projects.data"></projects-list>'
    })
  ;
}
