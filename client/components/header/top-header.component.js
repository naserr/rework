'use strict';
/* eslint no-sync: 0 */

import angular from 'angular';

class HeaderController {
  constructor($http, $rootScope, Auth, ProjectAuth) {
    'ngInject';
    this.Auth = Auth;
    this.$http = $http;
    this.currUser = Auth.getCurrentUserSync();
    this.isOwner = ProjectAuth.hasAccess(this.project, 'admin');

    $rootScope.$on('AVATAR_CHANGED', (e, u) => this.currUser.avatar = u.avatar);
  }

  isAssigned(task) {
    return !!_.find(task.users, {_id: this.currUser._id});
  }

  myTasksCount() {
    return _.filter(this.project.tasks, task => !!_.find(task.users, {_id: this.currUser._id})).length;
  }

  toggleSidebar() {
    this.projectComponent.isOpen = !this.projectComponent.isOpen;
  }

  setVisited(task) {
    let index = _.findIndex(this.project.tasks, t => t == task);
    this.$http.put(`api/projects/toggleTaskVisited/${this.project._id}`, {
        index: index,
        visited: true
      })
      .then(pr => {
        this.project.tasks = pr.data.tasks;
        task.visited = true;
      });
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
