'use strict';
import angular from 'angular';
import uiRouter from 'angular-ui-router';

export class boardListComponent {
  constructor(appConfig) {
    'ngInject';
    this.allBoards = appConfig.boards;
    if(this.onlyProjectBoards) {
      let lookup = _.keyBy(this.project.boards, b => b.name);
      this.allBoards = _.filter(this.allBoards, b => lookup[b.name] !== undefined);
    }
    this.allBoards = _.groupBy(this.allBoards, b => b.category);
  }
}

export default angular.module('reworkApp.project.boards.list', [uiRouter])
  .component('boardList', {
    template: require('./board-list.html'),
    bindings: {
      project: '=',
      onlyProjectBoards: '='
    },
    controller: boardListComponent,
    controllerAs: 'vm'
  })
  .name;
