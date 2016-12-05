'use strict';
import angular from 'angular';
import uiRouter from 'angular-ui-router';

export class BoardPreviewComponent {
  constructor($stateParams, $http, $state, Auth, appConfig) {
    'ngInject';
    this.board = _.find(appConfig.boards, {name: $stateParams.board});
    this.$http = $http;
    this.$state = $state;
    this.Auth = Auth;
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
    }).then(() => {
      this.Auth.setDefaultBoard(this.board.name);
      this.$state.go('project.desktop', {
        id: this.project._id,
        board: this.board.name
      });
    });
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
  .name;
