'use strict';
import angular from 'angular';
import uiRouter from 'angular-ui-router';

export class boardListComponent {
  constructor(appConfig, Auth, ProjectAuth) {
    'ngInject';
    let currentUser = Auth.getCurrentUserSync();
    this.allBoards = appConfig.boards;
    if(this.onlyProjectBoards) {
      let isAdmin = ProjectAuth.hasAccess(this.project, 'admin');
      let lookup = _.keyBy(this.project.boards, b => b.name);
      if(!isAdmin) {
        lookup = _.filter(this.project.boards, b => _.includes(b.users, currentUser._id));
        lookup = _.keyBy(lookup, b => b.name);
      }
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
