'use strict';
import angular from 'angular';
import uiRouter from 'angular-ui-router';

import bordList from './board-list/board-list.component';
import bordPreview from './board-preview/board-preview.component';
import projectDesktop from './project-desktop/project-desktop.component';
import projectManage from './project-manage/project-manage.component';

import routes from './project.routes';

export default angular.module('reworkApp.project', [uiRouter, bordList, bordPreview, projectDesktop, projectManage])
  .config(routes)
  .name;
