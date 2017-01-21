'use strict';
// import $ from 'jquery';
import angular from 'angular';

class SidebarComponent {
  user;
  cardFilters = {
    blue: false,
    pink: false,
    orange: false,
    green: false
  };

  constructor($rootScope, $state, Auth, ProjectAuth) {
    'ngInject';
    this.Auth = Auth;
    this.ProjectAuth = ProjectAuth;
    this.$state = $state;
    this.$rootScope = $rootScope;

    this.user = Auth.getCurrentUserSync();
    this.isOwner = ProjectAuth.hasAccess(this.project, 'admin');
  }

  // ui-sref="project.manage({id: $ctrl.project._id})"
  goToManageTeam() {
    if(this.$state.current.name === 'project.desktop') {
      this.$rootScope.$broadcast('MANAGE_BOARD_USER');
    }
    else {
      this.$state.go('project.manage', {id: this.project._id});
    }
  }

  newTask() {
    this.$rootScope.$broadcast('NEW_TASK');
  }

  chaneZoom(zoom) {
    this.$rootScope.$broadcast('ZOOM_CHANGED', zoom);
  }

  saveBoard(saveAs) {
    this.$rootScope.$broadcast('SAVE_BOARD', saveAs);
  }

  changeFilter(filter) {
    this.$rootScope.$broadcast('CHANGE_FILTER', filter);
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
