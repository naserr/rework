'use strict';

import angular from 'angular';

class SidebarComponent {
  user;

  constructor($rootScope, $state, Auth, ProjectAuth) {
    'ngInject';
    this.Auth = Auth;
    this.ProjectAuth = ProjectAuth;
    this.$state = $state;
    this.$rootScope = $rootScope;
    this.user = this.Auth.getCurrentUserSync();

    this.isOwner = this.ProjectAuth.hasAccess(this.project, 'admin');
  }

  newTask() {
    this.$rootScope.$broadcast('NEW_TASK');
  }

  goToDesktop() {
    this.boardName = this.user.defaultBoard;
    this.$state.go('project.desktop', {
      id: this.project._id,
      board: this.boardName
    });
  }
}

export default angular.module('directives.sidebar', [])
  .component('sidebar', {
    template: require('./sidebar.html'),
    bindings: {
      project: '<'
    },
    controller: SidebarComponent
  })
  .name;
