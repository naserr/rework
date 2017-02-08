'use strict';
import angular from 'angular';
import uiRouter from 'angular-ui-router';

import boardList from './board-list/board-list.component';
import boardPreview from './board-preview/board-preview.component';
import projectDesktop from './project-desktop/project-desktop.component';
import projectManage from './project-manage/project-manage.component';
import projectTask from './project-tasks/list-task.component';
import ProjectAuthService from './project-auth.service';

import routes from './project.routes';

export class projectComponent {
  isOpen = true;

  constructor($http, $rootScope, $scope, socket) {
    'ngInject';
    this.$http = $http;
    if(_.isArray(this.project)) {
      this.project = this.project[0];
    }

    socket.socket.emit('LOGIN', this.project._id);

    socket.syncUpdates('project', [], (event, item, array) => {
      this.project.cards = item.cards;
      this.project.tasks = item.tasks;
      this.project.users = item.users;
      this.project.boards = item.boards;
    });

    $scope.$on('$destroy', () => {
      socket.unsyncUpdates('project');
    });
  }

  getUser(id) {
    return _.find(this.users, {_id: id});
  }

  getUserAvatar(id) {
    let user = this.getUser(id);
    if(user && user.avatar && user.avatar.base64) {
      return user.avatar.base64;
    }
    else {
      return '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';
    }
  }

  findUsers(val) {
    return this.$http.get(`api/users/findByEmail/${val}`).then(function(response) {
      return response.data;
    });
  }
}

export default angular.module('reworkApp.project', [uiRouter, boardList, boardPreview, projectDesktop, projectManage, projectTask])
  .component('project', {
    template: require('./project.html'),
    bindings: {
      project: '=',
      myProjects: '=',
      users: '='
    },
    controller: projectComponent
  })
  .factory('ProjectAuth', ProjectAuthService)
  .config(routes)
  .name;
