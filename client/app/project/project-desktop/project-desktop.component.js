'use strict';
import 'ng-tags-input/build/ng-tags-input.min.css';
import 'ng-tags-input/build/ng-tags-input.bootstrap.min.css';

import angular from 'angular';
import uiRouter from 'angular-ui-router';
import ngDialog from 'ng-dialog';
import 'ng-tags-input';

export class projectDesktopComponent {
  zoom = 1;

  constructor($scope, $rootScope, $state, $stateParams, $http, Auth, socket, ngDialog, $log) {
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
      this.project.tasks = item.tasks;
    });

    $scope.$on('$destroy', function() {
      socket.unsyncUpdates('project');
      newTaskListener();
    });

    let project = this.project;
    $scope.$on('draggie.end', function($event, instance, originalEvent, pointer) {
      let index = _.findIndex(project.cards, {_id: instance.element.id});
      let updateCard = {
        index: `${index}`,
        position: {
          left: `${instance.position.x}px`,
          top: `${instance.position.y}px`
        }
      };
      $http.put(`api/projects/updateCards/${project._id}`, updateCard);
    });

    let newTaskListener = $rootScope.$on('NEW_TASK', function() {
      ngDialog.openConfirm({
          template: require('../project-tasks/new-task.html'),
          plain: true,
          controller: 'TaskController',
          controllerAs: 'vm',
          showClose: false,
          data: project,
          closeByDocument: false,
          closeByEscape: false/*,
        width: 600*/
        })
        .then(result => {
          let newTask = _.last(result.tasks);
          newTask.created = new Date();
          newTask.createdBy = _.pick(Auth.getCurrentUserSync(), ['_id', 'name', 'email', 'role']);
          let patches = [
            {
              op: 'add',
              path: '/tasks/-',
              value: newTask
            }
          ];
          $http.patch(`api/projects/${project._id}`, patches);
        });
    });
  }

  newCard() {
    let user = _.pick(this.Auth.getCurrentUserSync(), ['_id', 'name', 'email', 'role']);
    let patches = [
      {
        op: 'add',
        path: '/cards/-',
        value: {
          _id: `${this.boardName}${Date.now()}${_.random(1000, 1000000, false)}`,
          user,
          added: new Date(),
          board: this.boardName,
          position: {
            left: '1px',
            top: '1px'
          },
          content: '<h3>title</h3><p>stupid content...</p>'
        }
      }
    ];
    this.$http.patch(`api/projects/${this.project._id}`, patches);
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

  static focus(event) {
    var parent = null;
    if($(event.target).is('input')) {
      parent = $(event.target).parent();
    }
    else if($(event.target).is('textarea')) {
      parent = $(event.target).parent();
    }
    else {
      parent = $(event.target);
    }
    parent.toggleClass('animated bounceInUp');
  }
}

export default angular.module('reworkApp.project.desktop', [uiRouter, ngDialog, 'ngTagsInput'])
  .component('projectDesktop', {
    template: require('./project-desktop.html'),
    bindings: {project: '='},
    controller: projectDesktopComponent,
    controllerAs: 'vm'
  })
  .name;
