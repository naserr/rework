'use strict';
/* eslint no-sync: 0 */

import angular from 'angular';

class HeaderController {
  constructor($http, $rootScope, $scope, $state, $stateParams, Auth, ProjectAuth, ngDialog) {
    'ngInject';
    this.Auth = Auth;
    this.$http = $http;
    this.$scope = $scope;
    this.$state = $state;
    this.ngDialog = ngDialog;
    this.$stateParams = $stateParams;
    this.currUser = Auth.getCurrentUserSync();
    this.isOwner = ProjectAuth.hasAccess(this.project, 'admin');

    $rootScope.$on('AVATAR_CHANGED', (e, u) => {
      let user = _.find(this.projectComponent.users, {_id: u._id});
      if(user) {
        user.avatar = u.avatar;
      }
      this.currUser.avatar = u.avatar;
    });
  }

  isVisible(task) {
    return !!_.find(task.users, {
      _id: this.currUser._id,
      isVisited: false
    });
  }

  myUnVisitedTasks() {
    return _.filter(this.project.tasks, task => !!_.find(task.users, {
      _id: this.currUser._id,
      isVisited: false
    })).length;
  }

  toggleSidebar(event) {
    $(event.target).parent().toggleClass('open');
    this.projectComponent.isOpen = !this.projectComponent.isOpen;
  }

  setVisited(task) {
    let taskIndex = _.findIndex(this.project.tasks, t => t == task);
    let userIndex = _.findIndex(task.users, u => u._id == this.currUser._id);
    this.$http.put(`api/projects/toggleTaskVisited/${this.project._id}`, {
      taskIndex: taskIndex,
      userIndex: userIndex,
      isVisited: true
    })
      .then(pr => {
        this.project.tasks = pr.data.tasks;
        this.showTask(task);
      });
  }

  showTask(task) {
    // let boardName = (this.$stateParams.board || task.board).toUpperCase();
    this.$state.go('project.desktop', {
      id: this.project._id,
      board: task.board
    });
    this.selectedTask = task;
    this.ngDialog.openConfirm(
      {
        template: require('./show-task-dialog.html'),
        plain: true,
        // controller: 'TaskController',
        // controllerAs: 'vm',
        scope: this.$scope,
        showClose: false/*,
        width: 800,
        data: this.project,
        closeByDocument: false,
        closeByEscape: false*/
      });
  }
}

export default angular.module('directives.header', [])
  .component('topHeader', {
    require: {
      projectComponent: '^project'
    },
    bindings: {
      project: '=',
      myProjects: '='
    },
    template: require('./top-header.html'),
    controller: HeaderController,
    controllerAs: 'vm'
  })
  .name;
