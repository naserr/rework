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
