'use strict';
import angular from 'angular';
import uiRouter from 'angular-ui-router';

import boardList from './board-list/board-list.component';
import boardDetail from './board-detail/board-detail.component';

class BoardComponent {
  /*@ngInject*/
  constructor($state) {
    if(this.project.defaultBoard) {
      $state.go('project.desktop', {id: this.project.defaultBoard});
    } else {
      $state.go('project.board.list');
    }
  }
}

export default angular.module('reworkApp.project.board', [uiRouter, boardList, boardDetail])
  .config(routes)
  .component('board', {
    template: '',
    bindings: {
      project: '<'
    },
    controller: BoardComponent
  })
  .name;

function routes($stateProvider) {
  'ngInject';

  $stateProvider
    .state('project.board', {
      url: '/{id:[0-9a-fA-F]{24}}/boards',
      authenticate: true,
      resolve: {
        /*@ngInject*/
        project: ($http, $stateParams) => $http.get(`/api/projects/${$stateParams.id}`)
      },
      views: {
        '@': {
          template: '<board project="$resolve.project.data"></board>'
        }
      }
    });
}
