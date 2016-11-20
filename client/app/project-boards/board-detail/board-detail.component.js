'use strict';
import angular from 'angular';
import uiRouter from 'angular-ui-router';

export class BoardDetailComponent {
  constructor($stateParams, $http) {
    'ngInject';
    this.boardName = $stateParams.boardName;
    this.$http = $http;
  }

  selectBoard() {
    this.project.defaultBoard = this.boardName;
    let patches = [{
      op: 'replace',
      path: '/defaultBoard',
      value: this.boardName
    }];
    this.$http.patch(`api/projects/${this.project._id}`, patches);
  }
}

export default angular.module('reworkApp.project.board.detail', [uiRouter])
  .component('boardDetail', {
    template: require('./board-detail.html'),
    bindings: {
      project: '<'
    },
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
          template: '<board-detail project="$resolve.project.data"></board-detail>'
        }
      }
    });
}
