'use strict';
import angular from 'angular';
import uiRouter from 'angular-ui-router';

import projectsList from './projects-list/projects-list.component';
import projectDesktop from './project-desktop/project-desktop.component';

class ProjectComponent {
  /*@ngInject*/
  constructor($state) {
    if(this.user.isFresh) {
      $state.go('getStart');
    } else if(this.user.defaultProject) {
      $state.go('project.boards', {id: this.user.defaultProject});
    } else {
      $state.go('project.list');
    }
  }
}

export default angular.module('reworkApp.project', [uiRouter, projectsList, projectDesktop])
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
      url: '/projects',
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
