'use strict';
import angular from 'angular';
import uiRouter from 'angular-ui-router';

import boardList from './board-list/board-list.component';
import boardPreview from './board-preview/board-preview.component';

class BoardComponent {
  /*@ngInject*/
  constructor($state) {
    if(this.project.defaultBoard) {
      $state.go('project.desktop', {
        id: this.project._id,
        boardName: this.project.defaultBoard
      });
    } else {
      $state.go('project.boards.list');
    }
  }
}

export default angular.module('reworkApp.project.boards', [uiRouter, boardList, boardPreview])
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
    .state('project.boards', {
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
