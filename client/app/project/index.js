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

  constructor($http) {
    'ngInject';
    this.$http = $http;
    if(_.isArray(this.project)) {
      this.project = this.project[0];
    }
  }

  getUser(id) {
    return _.find(this.users, {_id: id});
  }

  getUserAvatar(id) {
    let userAvatar = this.getUser(id).avatar;
    if(userAvatar) {
      return userAvatar.base64;
    }
    return undefined;
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
