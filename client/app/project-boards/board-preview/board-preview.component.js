'use strict';
import angular from 'angular';
import uiRouter from 'angular-ui-router';

export class BoardPreviewComponent {
  constructor($stateParams, $http, $state, appConfig) {
    'ngInject';
    this.board = _.find(appConfig.boards, {name: $stateParams.boardName});
    this.$http = $http;
    this.$state = $state;
  }

  selectBoard() {
    // this.project.defaultBoard = this.board.name;
    // let patches = [{
    //   op: 'replace',
    //   path: '/defaultBoard',
    //   value: this.board.name
    // }];
    this.$http.post('api/projects/selectBoard', {
      id: this.project._id,
      board: this.board.name
    }).then(() => this.$state.go('project.desktop', {
      id: this.project._id,
      boardName: this.board.name
    }));
  }
}

export default angular.module('reworkApp.project.boards.preview', [uiRouter])
  .component('boardPreview', {
    template: require('./board-preview.html'),
    bindings: {
      project: '<'
    },
    controller: BoardPreviewComponent,
    controllerAs: 'vm'
  })
  .config(routes)
  .name;

function routes($stateProvider) {
  'ngInject';

  $stateProvider
    .state('project.boards.preview', {
      url: '/preview/:boardName',
      authenticate: true,
      views: {
        '@': {
          template: '<board-preview project="$resolve.project.data"></board-preview>'
        }
      }
    });
}
