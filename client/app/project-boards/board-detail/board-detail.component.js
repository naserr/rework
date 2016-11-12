'use strict';
import angular from 'angular';
import uiRouter from 'angular-ui-router';

export class BoardDetailComponent {
  constructor($stateParams) {
    'ngInject';
    this.boardName = $stateParams.boardName;
  }
}

export default angular.module('reworkApp.project.board.detail', [uiRouter])
  .component('boardDetail', {
    template: require('./board-detail.html'),
    controller: BoardDetailComponent,
    controllerAs: 'vm'
  })
  .config(routes)
  .name;

function routes($stateProvider) {
  'ngInject';

  $stateProvider
    .state('project.board.detail', {
      url: '/preview/:boardName',
      authenticate: true,
      views: {
        '@': {
          template: '<board-detail></board-detail>'
        }
      }
    });
}
