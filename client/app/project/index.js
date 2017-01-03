'use strict';
import angular from 'angular';
import uiRouter from 'angular-ui-router';

import boardList from './board-list/board-list.component';
import boardPreview from './board-preview/board-preview.component';
import projectDesktop from './project-desktop/project-desktop.component';
import projectManage from './project-manage/project-manage.component';
import newTask from './new-task/new-task.component';
import ProjectAuthService from './project-auth.service';

import routes from './project.routes';

export class projectComponent {
  isOpen = true;
}

export default angular.module('reworkApp.project', [uiRouter, boardList, boardPreview, projectDesktop, projectManage, newTask])
  .component('project', {
    template: require('./project.html'),
    bindings: {
      project: '='
    },
    controller: projectComponent
  })
  .factory('ProjectAuth', ProjectAuthService)
  .config(routes)
  .name;
