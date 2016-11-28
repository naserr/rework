'use strict';

export default function($stateProvider) {
  'ngInject';
  $stateProvider
    .state('project', {
      url: '/{id:[0-9a-fA-F]{24}}',
      abstract: true,
      authenticate: true,
      resolve: {
        /*@ngInject*/
        project: ($http, $stateParams) => $http.get(`/api/projects/${$stateParams.id}`)
      },
      views: {
        'header@': {
          template: '<top-header></top-header>'
        },
        'sidebar@': {
          template: '<sidebar></sidebar>'
        }
      }
    })
    .state('project.boards', {
      url: '/boards',
      abstract: true,
      authenticate: true
    })
    .state('project.boards.list', {
      url: '/list',
      authenticate: true,
      views: {
        '@': {
          template: '<board-list project="$resolve.project.data"></board-list>'
        }
      }
    })
    .state('project.boards.list.preview', {
      url: '/preview/:board',
      authenticate: true,
      views: {
        '@': {
          template: '<board-preview project="$resolve.project.data"></board-preview>'
        }
      }
    })
    .state('project.desktop', {
      url: '/{board:[a-fA-F]{1}}',
      authenticate: true,
      views: {
        '@': {
          template: '<project-desktop project="$resolve.project.data"></project-desktop>'
        }
      }
    })
    .state('project.manage', {
      url: '/manage',
      authenticate: true,
      views: {
        '@': {
          template: '<project-manage project="$resolve.project.data"></project-manage>'
        }
      }
    })
  ;
}