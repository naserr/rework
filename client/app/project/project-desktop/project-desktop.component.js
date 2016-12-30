'use strict';
import angular from 'angular';
import uiRouter from 'angular-ui-router';

export class projectDesktopComponent {
  zoom = 1;

  constructor($scope, $state, $stateParams, $http, Auth, socket, $log) {
    'ngInject';
    this.$http = $http;
    this.Auth = Auth;
    this.boardName = $stateParams.board.toUpperCase();
    this.board = this.project.boards.find(b => b.name.toUpperCase() === this.boardName);
    if(!this.board) {
      $log.error('دسترسی غیر مجاز');
      $state.go('project.boards.list');
    }

    socket.syncUpdates('project', [], (event, item, array) => {
      this.project.cards = item.cards;
    });

    $scope.$on('$destroy', function() {
      socket.unsyncUpdates('project');
    });

    let project = this.project;
    $scope.$on('draggie.end', function($event, instance, originalEvent, pointer) {
      let index = _.findIndex(project.cards, {_id: instance.element.id});
      let updateCard = [
        {
          op: 'replace',
          path: `/cards/${index}/left`,
          value: `${instance.position.x}px`
        },
        {
          op: 'replace',
          path: `/cards/${index}/top`,
          value: `${instance.position.y}px`
        }
      ];
      $http.patch(`api/projects/${project._id}`, updateCard);
      // }
    });
  }

  zoomIn() {
    if(this.zoom <= 5) {
      this.zoom += 0.25;
    }
  }

  zoomOut() {
    if(this.zoom > 0.5) {
      this.zoom -= 0.25;
    }
  }

  newCard() {
    let currUser = this.Auth.getCurrentUserSync();
    let user = {
      _id: currUser._id,
      name: currUser.name,
      email: currUser.email,
      role: currUser.role
    };
    let addCard = [
      {
        op: 'add',
        path: '/cards/-',
        value: {
          _id: `${this.boardName}${Date.now()}${_.random(1000, 1000000, false)}`,
          user,
          added: new Date(),
          board: this.boardName,
          left: '1px',
          top: '1px',
          content: '<h3>title</h3><p>stupid content...</p>'
        }
      }
    ];
    this.$http.patch(`api/projects/${this.project._id}`, addCard);
  }
}

export default angular.module('reworkApp.project.desktop', [uiRouter])
  .component('projectDesktop', {
    template: require('./project-desktop.html'),
    bindings: {project: '<'},
    controller: projectDesktopComponent,
    controllerAs: 'vm'
  })
  .name;
