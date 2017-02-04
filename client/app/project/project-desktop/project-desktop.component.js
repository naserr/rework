'use strict';
import 'ng-tags-input/build/ng-tags-input.min.css';
import 'ng-tags-input/build/ng-tags-input.bootstrap.min.css';

import angular from 'angular';
import uiRouter from 'angular-ui-router';
import ngDialog from 'ng-dialog';
import 'ng-tags-input';
import html2canvas from 'html2canvas/dist/html2canvas';
// import * as FileServer from 'file-saver';
import jsPDF from 'jspdf';
import projectChat from '../project-chat/project-chat.component';

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
  roles = [
    {
      name: 'مدیر',
      value: 2
    },
    {
      name: 'عضو تیم',
      value: 1
    },
    {
      name: 'مهمان',
      value: 0
    }
  ];

  constructor($scope, $rootScope, $state, $stateParams, $http, Auth, ProjectAuth, socket, ngDialog, $log) {
    'ngInject';
    this.$http = $http;
    this.Auth = Auth;
    this.$scope = $scope;
    this.$state = $state;
    this.ngDialog = ngDialog;
    this.ProjectAuth = ProjectAuth;
    this.socket = socket;
    this.$log = $log;
    this.boardName = $stateParams.board.toUpperCase();
    this.currUser = Auth.getCurrentUserSync();
    this.board = this.project.boards.find(b => b.name.toUpperCase() === this.boardName);
    let project = this.project;
    let isMember = _.findIndex(this.board.users, u => u._id === this.currUser._id) > -1;
    if(!this.board || (this.project.owner._id !== this.currUser._id && !isMember)) {
      $log.error('دسترسی غیر مجاز');
      $state.go('project.boards.privateList');
    }

    socket.syncUpdates('project', [], (event, item, array) => {
      this.project.cards = item.cards;
      this.project.tasks = item.tasks;
      this.project.users = item.users;
      this.project.boards = item.boards;
      this.board = item.boards.find(b => b.name.toUpperCase() === this.boardName);
    });

    $scope.$on('$destroy', () => {
      // socket.unsyncUpdates('project');
      newTaskListener();
      zoomListener();
      saveListener();
      filterListener();
      teamListener();
      remBoardListener();
    });

    // let project = this.project;
    $scope.$on('draggie.end', ($event, instance, originalEvent, pointer) => {
      let index = _.findIndex(this.project.cards, {_id: instance.element.id});
      let updateCard = {
        index: `${index}`,
        position: {
          left: `${instance.position.x}px`,
          top: `${instance.position.y}px`
        }
      };
      let pos = this.project.cards[index].position;
      if(pos.left != updateCard.position.left && pos.top != updateCard.position.top) {
        $http.put(`api/projects/updateCards/${this.project._id}`, updateCard);
      }
    });

    let teamListener = $rootScope.$on('MANAGE_BOARD_USER', () => {
      this.manageUsers();
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

    let remBoardListener = $rootScope.$on('REMOVE_BOARD', () => {
      this.onRemoveBoard();
    });

    let newTaskListener = $rootScope.$on('NEW_TASK', () => {
      ngDialog.openConfirm(
        {
          template: require('../project-tasks/new-task.html'),
          plain: true,
          controller: 'TaskController',
          controllerAs: 'vm',
          showClose: false,
          data: this.project,
          closeByDocument: false,
          closeByEscape: false
          //, width: 600
        })
        .then(result => {
          let newTask = _.last(result.tasks);
          newTask.created = new Date();
          newTask.createdBy = _.pick(this.currUser, ['_id', 'name', 'email', 'role']);
          newTask.isVisited = false;
          newTask.board = this.boardName;
          let patches = [
            {
              op: 'add',
              path: '/tasks/-',
              value: newTask
            }
          ];
          $http.patch(`api/projects/${this.project._id}`, patches);
        });
    });
  }

  newCard(cardType, p) {
    let pos = p || angular.element('#center-block').position();
    let user = _.pick(this.currUser, ['_id', 'name', 'email', 'role']);
    let patches = [
      {
        op: 'add',
        path: '/cards/-',
        value: {
          _id: `${this.boardName}${Date.now()}${_.random(1000, 1000000, false)}`,
          user,
          board: this.boardName,
          position: {
            left: `${pos.left}px`,
            top: `${pos.top + 45}px`
          },
          cardType,
          content: `${this.newContent[cardType].trim()}`
        }
      }
    ];
    this.$http.patch(`api/projects/${this.project._id}`, patches)
      .then(() => this.newContent[cardType] = '');
  }

  dbClick(e) {
    if(this.zoom > 1) {
      return;
    }
    let pos = angular.element('#target').position();
    this.newCard('blue', {
      top: e.pageY - (135 + (18 * ((this.zoom - 1) / 0.25))/* * this.zoom*/),
      left: (e.pageX + (-100 * ((this.zoom - 1) / 0.25))) - (pos.left/* * this.zoom*/) - 10
    });
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

  onSaveBoard(format) {
    let bName = this.boardName;
    let zoom = this.zoom;
    let boardElement = angular.element('#board');
    html2canvas(boardElement, {
      onrendered(canvas) {
        // canvas.toBlob(function(blob) {
        //   FileServer.saveAs(blob, 'Dashboard.png');
        // }, 'image/png');

        let width = canvas.width * zoom + 10;
        let height = canvas.height * zoom + 10;
        let canvas2 = document.createElement('canvas');
        let ctx = canvas2.getContext('2d');
        ctx.canvas.width = width;
        ctx.canvas.height = height;
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, width, height);
        ctx.drawImage(canvas, -10, 0, width - 10, height);
        let img = canvas2.toDataURL('image/png');
        if(format === 'pdf') {
          let doc = new jsPDF({
            orientation: 'landscape'
          });
          doc.addImage(img, 'JPEG', 0, 0);
          doc.save(`board-${bName}`);
        } else if(format === 'jpg') {
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
      cards = cards.concat(_.filter(this.project.cards, {
        board: this.boardName,
        cardType: 'blue'
      }));
    }
    if(this.filter.pink) {
      cards = cards.concat(_.filter(this.project.cards, {
        board: this.boardName,
        cardType: 'pink'
      }));
    }
    if(this.filter.orange) {
      cards = cards.concat(_.filter(this.project.cards, {
        board: this.boardName,
        cardType: 'orange'
      }));
    }
    if(this.filter.green) {
      cards = cards.concat(_.filter(this.project.cards, {
        board: this.boardName,
        cardType: 'green'
      }));
    }
    if(!(this.filter.blue || this.filter.pink || this.filter.orange || this.filter.green)) {
      cards = _.filter(this.project.cards, {board: this.boardName});
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
    this.$http.patch(`api/projects/${this.project._id}`, patches);
  }

  changeColor(card, cardType) {
    let index = _.findIndex(this.project.cards, {_id: card._id});
    let patches = [
      {
        op: 'replace',
        path: `/cards/${index}/cardType`,
        value: cardType
      }
    ];
    this.$http.patch(`api/projects/${this.project._id}`, patches);
  }

  changeCardScale(card, scale) {
    let index = _.findIndex(this.project.cards, {_id: card._id});
    let patches = [
      {
        op: 'replace',
        path: `/cards/${index}/scale`,
        value: scale
      }
    ];
    this.$http.patch(`api/projects/${this.project._id}`, patches);
  }

  manageUsers() {
    this.ngDialog.openConfirm(
      {
        template: require('./board-users.html'),
        plain: true,
        // controller: 'TaskController',
        // controllerAs: 'vm',
        scope: this.$scope,
        showClose: false,
        width: 800/*,
        data: this.project,
        closeByDocument: false,
        closeByEscape: false*/
      });
  }

  addUserToBoard(newUser) {
    if(!newUser) {
      return;
    }
    if(this.ProjectAuth.getUserRole(this.project) === 2) {
      let oldUser = _.find(this.board.users, {_id: newUser._id});
      if(oldUser) {
        return this.$log.error('این کاربر قبلا اضافه شده است');
      }
      let u = _.pick(newUser, ['_id', 'name', 'email', 'role']);
      let index = _.findIndex(this.project.boards, b => b.name === this.board.name);
      this.$http.put(`api/projects/newBoardUser/${this.project._id}`,
        {
          boardIndex: index,
          user: u
        })
        .then(() => {
          oldUser = _.find(this.project.users, {_id: newUser._id});
          if(!oldUser) {
            this.users.push(newUser);
          }
          this.newUser = null;
        })
        .catch(err => {
          if(err.status === 400) {
            return this.$log.error(err.data);
          }
        });
    }
    else {
      this.$log.warn('فقط مدیر میتواند کاربر اضافه کند');
    }
  }

  removeUser(user) {
    if(this.ProjectAuth.getUserRole(this.project) === 2) {
      let boardIndex = _.findIndex(this.project.boards, b => b.name === this.board.name);
      let userIndex = _.findIndex(this.project.boards[boardIndex].users, u => u._id === user._id);

      let patches = [
        {
          op: 'remove',
          path: `/boards/${boardIndex}/users/${userIndex}`
        }
      ];
      this.$http.patch(`api/projects/${this.project._id}`, patches);
    }
    else {
      this.$log.warn('فقط مدیر میتواند کاربر حذف کند');
    }
  }

  onRemoveBoard() {
    if(this.ProjectAuth.getUserRole(this.project) === 2) {
      let boardIndex = _.findIndex(this.project.boards, b => b.name === this.board.name);

      let patches = [
        {
          op: 'remove',
          path: `/boards/${boardIndex}`
        }
      ];
      this.$http.patch(`api/projects/${this.project._id}`, patches)
        .then(() => this.$state.go('project.boards.privateList'));
    }
    else {
      this.$log.warn('فقط مدیر میتواند ابزار را حذف کند');
    }
  }

  changeRole(user) {
    if(this.ProjectAuth.getUserRole(this.project) === 2) {
      let boardIndex = _.findIndex(this.project.boards, b => b.name === this.board.name);
      let userIndex = _.findIndex(this.project.boards[boardIndex].users, u => u._id === user._id);

      let patches = [
        {
          op: 'replace',
          path: `/boards/${boardIndex}/users/${userIndex}/role`,
          value: user.role
        }
      ];
      this.$http.patch(`api/projects/${this.project._id}`, patches);
    }
    else {
      this.$log.warn('فقط مدیر میتواند نقش کاربر را تغیر دهد');
    }
  }

  focusTextArea(event, card) {
    card.oldContent = card.content;
    $(event.target).focus();
  }

  saveContent(card) {
    if(card.oldContent == card.content) {
      return;
    }
    let index = _.findIndex(this.project.cards, {_id: card._id});
    let patches = [
      {
        op: 'replace',
        path: `/cards/${index}/content`,
        value: card.content
      }
    ];
    this.$http.patch(`api/projects/${this.project._id}`, patches);
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
    if(parent.css('bottom') == '-10px') {
      parent.animate({bottom: '60px'}, 'fast');
    }
    else {
      // $('.new_cart_wrapper .cart').animate({bottom: '0'}, 'fast');
      parent.animate({bottom: 0}, 'fast');
    }
  }

  blur() {
    $('.new_cart_wrapper .cart').animate({bottom: '0'}, 'fast');
  }
}

export default angular.module('reworkApp.project.desktop', [projectChat, uiRouter, ngDialog, 'ngTagsInput'])
  .component('projectDesktop', {
    template: require('./project-desktop.html'),
    require: {
      projectCom: '^project'
    },
    bindings: {
      project: '=',
      users: '='
    },
    controller: projectDesktopComponent,
    controllerAs: 'vm'
  })
  .name;
