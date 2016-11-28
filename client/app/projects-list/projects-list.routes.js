'use strict';

export default function($stateProvider) {
  'ngInject';
  $stateProvider
    .state('projects', {
      url: '/projects',
      abstract: true,
      authenticate: true,
      resolve: {
        /*@ngInject*/
        projects: $http => $http.get('/api/projects/me')
      },
      template: '<div ui-view></div>'
      // views: {
      //   'header@': {
      //     template: '<top-header></top-header>'
      //   },
      //   'sidebar@': {
      //     template: ''
      //   }
      // }
    })
    .state('projects.list', {
      url: '/list',
      authenticate: true,
      template: '<projects-list projects="$resolve.projects.data"></projects-list>'
    })
  ;
}
