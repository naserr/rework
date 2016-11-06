'use strict';
import angular from 'angular';
import uiRouter from 'angular-ui-router';

export class projectDetailComponent {
  constructor($http) {
    'ngInject';
    this.$http = $http;
  }
}

export default angular.module('reworkApp.project.detail', [uiRouter])
  .component('projectDetail', {
    template: require('./project-detail.html'),
    bindings: {project: '<'},
    controller: projectDetailComponent,
    controllerAs: 'vm'
  })
  .config(routes)
  .name;

function routes($stateProvider) {
  'ngInject';

  $stateProvider
    .state('app.project.detail', {
      url: '/:id',
      authenticate: true,
      views: {
        '@': {
          template: '<project-detail project="$resolve.project.data"></project-detail>',
          resolve: {
            /*@ngInject*/
            project: ($http, $stateParams) => $http.get(`/api/projects/${$stateParams.id}`)
          }
        }
      }
    });
}
