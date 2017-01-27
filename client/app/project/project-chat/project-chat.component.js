'use strict';
import 'ng-tags-input/build/ng-tags-input.min.css';
import 'ng-tags-input/build/ng-tags-input.bootstrap.min.css';

import angular from 'angular';
import uiRouter from 'angular-ui-router';
import ngDialog from 'ng-dialog';
import 'ng-tags-input';
import html2canvas from 'html2canvas/dist/html2canvas.min';
import jsPDF from 'jspdf';

export class projectChatComponent {
  SERVER_EVENTS = {
    init: 'INIT',
    newUser: 'NEW_USER',
    msgCreated: 'MSG_CREATED',
    leave: 'LEAVE'
  };
  CLIENT_EVENTS = {
    join: 'JOIN',
    leave: 'LEAVE',
    newMsg: 'NEW_MSG'
  };
  msgArr = [];
  users = [];

  constructor($scope, Auth, socket) {
    'ngInject';
    this.socket = socket;
    this.currUser = Auth.getCurrentUserSync();
    this.roomId = `${this.project._id}${this.board.name}`;

    socket.socket.emit(this.CLIENT_EVENTS.join, {
      roomId: this.roomId,
      user: this.currUser
    });

    socket.socket.on(this.SERVER_EVENTS.init, data => {
      this.msgArr = _.reverse(data);
    });

    socket.socket.on(this.SERVER_EVENTS.newUser, data => {
      console.log('NEW_USER > ', data);
      // $log.info(`<b>${data.user.user.name}</b> وارد ابزار شد`);
      this.users = data.users;
    });

    socket.socket.on(this.SERVER_EVENTS.leave, data => {
      console.log('LEAVE > ', data);
      // $log.info(`<b>${data.user.user.name}</b> ابزار را ترک کرد `);
      this.users = data.users;
    });

    socket.socket.on(this.SERVER_EVENTS.msgCreated, data => this.msgArr.push(data));

    $scope.$on('$destroy', () => {
      socket.socket.emit(this.CLIENT_EVENTS.leave, {
        roomId: this.roomId,
        user: this.currUser
      });
      _.each(_.values(this.SERVER_EVENTS), e => socket.socket.removeAllListeners(e));
    });

    $scope.$watchCollection(() => this.msgArr, () => {
      var $list = $('#messages');
      var scrollHeight = $list.prop('scrollHeight');
      $list.animate({scrollTop: scrollHeight + 500}, 500);
    });
  }

  sendMessage(msg) {
    if(!msg) {
      return;
    }
    let data = {
      roomId: this.roomId,
      user: this.currUser,
      content: msg
    };
    this.socket.socket.emit(this.CLIENT_EVENTS.newMsg, data);
    this.message = '';
  }

  focusChat(event) {
    var parent = null;
    console.log($(event.target));
    if($(event.target).is('div.header_chat_wrapper')) {
      parent = $(event.target).parent();
    }
    else if($(event.target).is('h6')) {
      parent = $(event.target).parent().parent();
    }
    else if($(event.target).is('i') && $(event.target).hasClass('group_icon')) {
      parent = $(event.target).parent().parent().parent();
    }
    else if($(event.target).is('i') && $(event.target).hasClass('massage_icon')) {
      parent = $(event.target).parent().parent().parent();
    }
    else {
      parent = $(event.target);
    }
    if(parent.css('bottom') == '-27px') {
      parent.animate({bottom: '210px'}, 'fast');
    }

  }

  blurChat() {
    $('.chat_wrapper').animate({bottom: '-27'}, 'fast');
  }
}

export default angular.module('reworkApp.project.chat', [])
  .component('projectChat', {
    template: require('./project-chat.html'),
    require: {
      projectCom: '^project'
    },
    bindings: {
      project: '=',
      board: '='
    },
    controller: projectChatComponent,
    controllerAs: 'vm'
  })
  .name;
