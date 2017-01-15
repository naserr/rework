'use strict';
// import $ from 'jquery';
import angular from 'angular';

class SidebarComponent {
  user;

  constructor($rootScope, $state, Auth, ProjectAuth) {
    'ngInject';
    this.Auth = Auth;
    this.ProjectAuth = ProjectAuth;
    this.$state = $state;
    this.$rootScope = $rootScope;

    this.user = Auth.getCurrentUserSync();
    this.isOwner = ProjectAuth.hasAccess(this.project, 'admin');
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

  chaneZoom(zoom) {
    this.$rootScope.$broadcast('ZOOM_CHANGED', zoom);
  }

  accordion(event) {
    var parent = null;
    if($(event.target).is('i')) {
      parent = $(event.target).parent();
    }
    var parent = $(event.target);
    if(parent.hasClass('active')) {
      parent.removeClass('active');
      parent.siblings('ul.sub_menu_desktop').slideUp();
    } else {
      parent.addClass('active');
      parent.siblings('ul.sub_menu_desktop').slideDown();
    }
  }
}

export default angular.module('directives.sidebar', [])
  .component('sidebar', {
    template: require('./sidebar.html'),
    bindings: {
      project: '='
    },
    controller: SidebarComponent
  })
  .name;
