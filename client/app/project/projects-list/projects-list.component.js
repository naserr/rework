'use strict';
import angular from 'angular';
import uiRouter from 'angular-ui-router';

export class projectsListComponent {
  constructor($scope, $http, $state, socket) {
    'ngInject';
    this.$http = $http;
    this.$state = $state;

    socket.syncUpdates('project', this.projects);

    $scope.$on('$destroy', function() {
      socket.unsyncUpdates('project');
    });
  }

  delete(id) {
    this.$http.delete(`/api/projects/${id}`);
  }
}

export default angular.module('reworkApp.project.list', [uiRouter])
  .component('projectsList', {
    template: require('./projects-list.html'),
    bindings: {projects: '<'},
    controller: projectsListComponent,
    controllerAs: 'vm'
  })
  .config(routes)
  .name;

function routes($stateProvider) {
  'ngInject';

  $stateProvider
    .state('app.project.list', {
      url: '/list',
      authenticate: true,
      views: {
        '@': {
          template: '<projects-list projects="$resolve.projects.data"></projects-list>',
          resolve: {
            /*@ngInject*/
            projects: $http => $http.get('/api/projects/me')
          }
        }
      }
    });
}
