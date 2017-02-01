'use strict';

export default function($stateProvider) {
  'ngInject';
  $stateProvider
    .state('project', {
      url: '/{id:[0-9a-fA-F]{24}}',
      abstract: true,
      authenticate: true,
      template: '<project project="$resolve.project.data" my-projects="$resolve.myProjects.data" users="$resolve.users.data"></project>',
      resolve: {
        /*@ngInject*/
        project: ($http, $stateParams) => $http.get(`/api/projects/${$stateParams.id}`),
        users: ($http, $stateParams) => $http.get(`api/users/projectUsers/${$stateParams.id}`),
        myProjects: $http => $http.get('/api/projects/me')
      }
    })
    .state('project.boards', {
      url: '/boards',
      abstract: true,
      authenticate: true
    })
    .state('project.boards.list', {
      url: '/all',
      authenticate: true,
      views: {
        '@project': {
          template: '<board-list project="$resolve.project.data" only-project-boards="false"></board-list>'
        }
      }
    })
    .state('project.boards.list.preview', {
      url: '/preview/:board',
      authenticate: true,
      views: {
        '@project': {
          template: '<board-preview project="$resolve.project.data"></board-preview>'
        }
      }
    })
    .state('project.boards.privateList', {
      url: '/list',
      authenticate: true,
      views: {
        '@project': {
          template: '<board-list project="$resolve.project.data" only-project-boards="true"></board-list>'
        }
      }
    })
    .state('project.desktop', {
      url: '/{board:[a-fA-F]{1}}',
      authenticate: true,
      views: {
        '@project': {
          template: '<project-desktop project="$resolve.project.data" users="$resolve.users.data"></project-desktop>'
        }
      }
    })
    .state('project.tasks', {
      url: '/{board:[a-fA-F]{1}}/tasks',
      authenticate: true,
      views: {
        '@project': {
          template: '<list-task project="$resolve.project.data"></list-task>'
        }
      }
    })
    .state('project.manage', {
      url: '/manage',
      authenticate: true,
      views: {
        '@project': {
          template: '<project-manage project="$resolve.project.data" users="$resolve.users.data"></project-manage>'
        }
      }
    })
    .state('project.profile', {
      url: '/profile',
      authenticate: true,
      views: {
        '@project': {
          // template: '<project-manage project="$resolve.project.data"></project-manage>'
          template: require('../account/settings/settings.html'),
          controller: 'SettingsController',
          controllerAs: 'vm'
        }
      }
    })
  ;
}
