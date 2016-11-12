'use strict';
import angular from 'angular';
import uiRouter from 'angular-ui-router';

export class projectDetailComponent {
  constructor($scope, $state, $stateParams, socket, appConfig) {
    'ngInject';
    this.allBoards = appConfig.boards;

    socket.socket.on('project:remove', item => {
      if(item && item._id === $stateParams.id) {
        return $state.go('project.list');
      }
    });

    $scope.$on('$destroy', function() {
      socket.unsyncUpdates('project');
    });
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
    .state('project.detail', {
      url: '/{id:[0-9a-fA-F]{24}}',
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
