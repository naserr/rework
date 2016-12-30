'use strict';

import angular from 'angular';

class SidebarComponent {
  user;

  constructor($state, Auth, ProjectAuth) {
    'ngInject';
    this.Auth = Auth;
    this.$state = $state;
    this.user = this.Auth.getCurrentUserSync();
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
