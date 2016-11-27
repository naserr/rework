'use strict';
import angular from 'angular';
import uiRouter from 'angular-ui-router';

export class projectDesktopComponent {
  constructor($stateParams) {
    'ngInject';
    console.log(`project ${this.project}`);
    console.log(`boardName ${$stateParams.boardName}`);
  }
}

export default angular.module('reworkApp.project.desktop', [uiRouter])
  .component('projectDesktop', {
    template: require('./project-desktop.html'),
    bindings: {project: '<'},
    controller: projectDesktopComponent,
    controllerAs: 'vm'
  })
  .config(routes)
  .name;

function routes($stateProvider) {
  'ngInject';

  $stateProvider
    .state('project.desktop', {
      url: '^/{id:[0-9a-fA-F]{24}}/:boardName',
      authenticate: true,
      views: {
        '@': {
          template: '<project-desktop project="$resolve.project.data"></project-desktop>',
          resolve: {
            /*@ngInject*/
            project: ($http, $stateParams) => $http.get(`/api/projects/${$stateParams.id}`)
          }
        }
      }
    });
}
