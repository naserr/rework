'use strict';
import angular from 'angular';
import uiRouter from 'angular-ui-router';

export class boardListComponent {
  constructor(appConfig) {
    'ngInject';
    this.allBoards = _.groupBy(appConfig.boards, b => b.category);
  }
}

export default angular.module('reworkApp.project.boards.list', [uiRouter])
  .component('boardList', {
    template: require('./board-list.html'),
    bindings: {
      project: '<'
    },
    controller: boardListComponent,
    controllerAs: 'vm'
  })
  .name;
