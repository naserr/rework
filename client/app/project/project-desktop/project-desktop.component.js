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
  newContent = {
    blue: '',
    pink: '',
    orange: '',
    green: ''
  };
  filter = {
    blue: false,
    pink: false,
    orange: false,
    green: false
  };

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
      this.justRemoved = false;
      this.project.cards = item.cards;
      this.project.tasks = item.tasks;
    });

    $scope.$on('$destroy', function() {
      socket.unsyncUpdates('project');
      newTaskListener();
      zoomListener();
      saveListener();
      filterListener();
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
      let pos = project.cards[index].position;
      if(pos.left != updateCard.position.left && pos.top != updateCard.position.top) {
        $http.put(`api/projects/updateCards/${project._id}`, updateCard);
      }
    });

    let zoomListener = $rootScope.$on('ZOOM_CHANGED', (e, zoomType) => {
      this.onZoomChanged(zoomType);
    });

    let saveListener = $rootScope.$on('SAVE_BOARD', (e, saveAs) => {
      this.onSaveBoard(saveAs);
    });

    let filterListener = $rootScope.$on('CHANGE_FILTER', (e, filter) => {
      this.filter = filter;
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
          newTask.isVisited = false;
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
            top: '45px'
          },
          type,
          content: `${this.newContent[type]}`
        }
      }
    ];
    this.$http.patch(`api/projects/${this.project._id}`, patches)
      .then(() => this.newContent[type] = '');
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
    let zoom = this.zoom;
    html2canvas(angular.element('#board'), {
      onrendered: function(canvas) {
        let width = canvas.width * zoom;
        let height = canvas.height * zoom;
        let canvas2 = document.createElement('canvas');
        let ctx = canvas2.getContext('2d');
        ctx.canvas.width = width;
        ctx.canvas.height = height;
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, width, height);
        ctx.drawImage(canvas, 0, 0, width, height);
        let img = canvas2.toDataURL('image/png');
        if(saveAs === 'pdf') {
          let doc = new jsPDF({
            unit: 'px',
            format: 'a3'
          });
          doc.addImage(img, 'JPEG', 0, 0);
          doc.save(`board-${bName}`);
        }
        else if(saveAs === 'jpg') {
          var a = document.createElement('a');
          a.href = img;
          a.download = `board-${bName}`;
          a.click();
        }
      }
    });
  }

  filterCards() {
    let cards = [];
    if(this.filter.blue) {
      cards = cards.concat(_.filter(this.project.cards, {type: 'blue'}));
    }
    if(this.filter.pink) {
      cards = cards.concat(_.filter(this.project.cards, {type: 'pink'}));
    }
    if(this.filter.orange) {
      cards = cards.concat(_.filter(this.project.cards, {type: 'orange'}));
    }
    if(this.filter.green) {
      cards = cards.concat(_.filter(this.project.cards, {type: 'green'}));
    }
    if(!(this.filter.blue || this.filter.pink || this.filter.orange || this.filter.green)) {
      cards = this.project.cards;
    }
    return cards;
  }

  removeCard(card) {
    let index = _.findIndex(this.project.cards, {_id: card._id});
    let patches = [
      {
        op: 'remove',
        path: `/cards/${index}`
      }
    ];
    this.$http.patch(`api/projects/${this.project._id}`, patches)
      .then(() => this.justRemoved = false);
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
      parent.animate({bottom: '70px'}, 'fast');
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
