'use strict';
import angular from 'angular';

import projectsList from './projects-list/projects-list.component';
import projectDetail from './project-detail/project-detail.component';

export default angular.module('reworkApp.project', [projectsList, projectDetail])
  .config(routes)
  .name;

function routes($stateProvider) {
  'ngInject';

  $stateProvider
    .state('app.project', {
      url: 'project',
      abstract: true,
      resolve: {
        /*@ngInject*/
        user: Auth => Auth.getCurrentUser()
      }
    });
}
