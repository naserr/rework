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

  accordion(event){
    var parent = null;
    if($(event.target).is('i')) {
      parent = $(event.target).parent();
    }
    var parent=$(event.target);
    if(parent.hasClass('active')) {
      parent.removeClass('active');
      parent.siblings('ul.sub_menu_desktop').slideUp();
    } else {
      $('ul.sub_menu_desktop.active').removeClass('active');
      $('ul.sub_menu_desktop.active').slideUp(700);
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
