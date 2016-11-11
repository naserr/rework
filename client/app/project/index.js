'use strict';
import angular from 'angular';
import uiRouter from 'angular-ui-router';

import projectsList from './projects-list/projects-list.component';
import projectDetail from './project-detail/project-detail.component';

class ProjectComponent {
  /*@ngInject*/
  constructor($state) {
    if(this.user.isFresh) {
      $state.go('getStart');
    } else if(this.user.defaultProject) {
      $state.go('project.detail', {id: this.user.defaultProject});
    } else {
      $state.go('project.list');
    }
  }
}

export default angular.module('reworkApp.project', [uiRouter, projectsList, projectDetail])
  .config(routes)
  .component('project', {
    template: '',
    bindings: {
      user: '<'
    },
    controller: ProjectComponent
  })
  .name;

function routes($stateProvider) {
  'ngInject';

  $stateProvider
    .state('project', {
      url: '/',
      // abstract: true,
      authenticate: true,
      views: {
        'header@': {
          template: '<top-header></top-header>'
        },
        'sidebar@': {
          template: '<sidebar></sidebar>'
        },
        '@': {
          template: '<project user="$resolve.user"></project>',
          resolve: {
            /*@ngInject*/
            user: Auth => Auth.getCurrentUser()
          }
        }
      }
    });
}
