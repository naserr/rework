'use strict';
import angular from 'angular';
import uiRouter from 'angular-ui-router';
import routes from './projects-list.routes';

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

export default angular.module('reworkApp.projects.list', [uiRouter])
  .component('projectsList', {
    template: require('./projects-list.html'),
    bindings: {projects: '='},
    controller: projectsListComponent,
    controllerAs: 'vm'
  })
  .config(routes)
  .name;
