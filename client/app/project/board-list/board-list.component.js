'use strict';
import angular from 'angular';
import uiRouter from 'angular-ui-router';

export class boardListComponent {
  constructor($scope, socket, appConfig, Auth, ProjectAuth) {
    'ngInject';
    let currentUser = Auth.getCurrentUserSync();
    this.allBoards = appConfig.boards;
    if(this.onlyProjectBoards) {
      let isAdmin = ProjectAuth.hasAccess(this.project, 'admin');
      let lookup = _.keyBy(this.project.boards, b => b.name);
      if(!isAdmin) {
        lookup = _.filter(this.project.boards, b => _.findIndex(b.users, {_id: currentUser._id}) > -1);
        lookup = _.keyBy(lookup, b => b.name);
      }
      this.allBoards = _.filter(this.allBoards, b => lookup[b.name] !== undefined);
    }
    this.allBoards = _.groupBy(this.allBoards, b => b.category);

    socket.syncUpdates('project', [], (event, item, array) => {
      console.log('mohsen> 1395422', 123456789);
      this.project = item;
      if(this.onlyProjectBoards) {
        this.allBoards = appConfig.boards;
        let isAdmin = ProjectAuth.hasAccess(this.project, 'admin');
        let lookup = _.keyBy(this.project.boards, b => b.name);
        if(!isAdmin) {
          lookup = _.filter(this.project.boards, b => _.findIndex(b.users, {_id: currentUser._id}) > -1);
          lookup = _.keyBy(lookup, b => b.name);
        }
        this.allBoards = _.filter(this.allBoards, b => lookup[b.name] !== undefined);
      }
      this.allBoards = _.groupBy(this.allBoards, b => b.category);
    });

    $scope.$on('$destroy', () => {
      socket.unsyncUpdates('project');
    });
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

// $rootScope.$on('PROJECT_UPDATED', () => {
//   let currentUser = Auth.getCurrentUserSync();
//   this.allBoards = appConfig.boards;
//   if(this.onlyProjectBoards) {
//     let isAdmin = ProjectAuth.hasAccess(this.project, 'admin');
//     let lookup = _.keyBy(this.project.boards, b => b.name);
//     if(!isAdmin) {
//       lookup = _.filter(this.project.boards, b => _.findIndex(b.users, {_id: currentUser._id}) > -1);
//       lookup = _.keyBy(lookup, b => b.name);
//     }
//     this.allBoards = _.filter(this.allBoards, b => lookup[b.name] !== undefined);
//   }
//   this.allBoards = _.groupBy(this.allBoards, b => b.category);
// });
