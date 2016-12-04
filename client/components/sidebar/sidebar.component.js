'use strict';
/* eslint no-sync: 0 */

import angular from 'angular';

class SidebarComponent {
  constructor($state, Auth) {
    'ngInject';
    this.Auth = Auth;
    this.$state = $state;
  }

  goToDesktop() {
    this.boardName = this.Auth.getCurrentUserSync().defaultBoard;
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
