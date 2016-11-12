'use strict';
import angular from 'angular';
import uiRouter from 'angular-ui-router';

export class ProjectBoardsComponent {
  constructor($scope, $state, socket, appConfig) {
    'ngInject';
    this.allBoards = appConfig.boards;

    socket.socket.on('project:remove', item => {
      if(item && item._id === this.project._id) {
        return $state.go('project.list');
      }
    });

    $scope.$on('$destroy', function() {
      socket.unsyncUpdates('project');
    });
  }
}

export default angular.module('reworkApp.project.board.detail', [uiRouter])
  .component('boardDetail', {
    template: require('./project-detail.html'),
    bindings: {project: '<'},
    controller: ProjectBoardsComponent,
    controllerAs: 'vm'
  })
  .config(routes)
  .name;

function routes($stateProvider) {
  'ngInject';

  $stateProvider
    .state('project.board.boards', {
      url: '/:name',
      authenticate: true,
      views: {
        '@': {
          template: '<board-detail></board-detail>'
        }
      }
    });
}
