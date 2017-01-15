'use strict';
/* eslint no-sync: 0 */

import angular from 'angular';

class HeaderController {
  constructor(Auth, ProjectAuth) {
    'ngInject';
    this.Auth = Auth;
    this.currUser = Auth.getCurrentUserSync();
    this.isOwner = ProjectAuth.hasAccess(this.project, 'admin');
  }

  isAssigned(task) {
    return !!_.find(task.users, {_id: this.currUser._id});
  }

  myTasksCount() {
    return _.filter(this.project.tasks, task => !!_.find(task.users, {_id: this.currUser._id})).length;
  }

  toggleSidebar(event) {
    $(event.target).parent().toggleClass('open');
    this.projectComponent.isOpen = !this.projectComponent.isOpen;
  }
}

export default angular.module('directives.header', [])
  .component('topHeader', {
    require: {
      projectComponent: '^project'
    },
    bindings: {project: '='},
    template: require('./top-header.html'),
    controller: HeaderController,
    controllerAs: 'vm'
  })
  .name;
