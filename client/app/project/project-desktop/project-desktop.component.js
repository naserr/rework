'use strict';
import 'ng-tags-input/build/ng-tags-input.min.css';
import 'ng-tags-input/build/ng-tags-input.bootstrap.min.css';

import angular from 'angular';
import uiRouter from 'angular-ui-router';
import ngDialog from 'ng-dialog';
import 'ng-tags-input';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

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
      zoomListener();
      saveListener();
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

    let zoomListener = $rootScope.$on('ZOOM_CHANGED', (e, zoomType) => {
      this.onZoomChanged(zoomType);
    });

    let saveListener = $rootScope.$on('SAVE_BOARD', (e, saveAs) => {
      this.onSaveBoard(saveAs);
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
          newTask.visited = false;
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

  newCard(type) {
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
          type,
          content: `<p>${this.newCardContent}</p>`
        }
      }
    ];
    this.$http.patch(`api/projects/${this.project._id}`, patches)
      .then(() => this.newCardContent = '');
  }

  onZoomChanged(zoomType) {
    if(zoomType === 'ZOOM_IN') {
      if(this.zoom <= 5) {
        this.zoom += 0.25;
      }
    }
    else if(zoomType === 'ZOOM_OUT') {
      if(this.zoom > 0.5) {
        this.zoom -= 0.25;
      }
    }
    else if(zoomType === 'ZOOM_RES') {
      this.zoom = 1;
    }
  }

  onSaveBoard(saveAs) {
    let bName = this.boardName;
    html2canvas(angular.element('#board'), {
      onrendered: function(canvas) {
        if(saveAs === 'pdf') {
          var img = canvas.toDataURL("image/png"),
            doc = new jsPDF({
              unit: 'px',
              format: 'a3'
            });
          doc.addImage(img, 'JPEG', 0, 0);
          doc.save(`board-${bName}`);
        }
        else if(saveAs === 'jpg') {
          var a = document.createElement('a');
          a.href = canvas.toDataURL('image/png');
          a.download = `board-${bName}`;
          a.click();
        }
      }
    });
  }

  focus(event) {
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
    if(parent.css('bottom') == '0px') {
      parent.animate({bottom: '100px'}, 'fast');
    }
    else {
      //      $('.new_cart_wrapper .cart').animate({bottom: '0'}, 'fast');
      parent.animate({bottom: 0}, 'fast');
    }
  }

  blur() {
    $('.new_cart_wrapper .cart').animate({bottom: '0'}, 'fast');
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
