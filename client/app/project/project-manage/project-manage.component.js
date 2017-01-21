'use strict';
import angular from 'angular';
import uiRouter from 'angular-ui-router';
import typeahead from 'angular-ui-bootstrap/src/typeahead';
import tooltip from 'angular-ui-bootstrap/src/tooltip';

export class projectManageComponent {
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

  constructor($http, $log) {
    'ngInject';
    this.$http = $http;
    this.$log = $log;
  }

  getUser(id) {
    return _.find(this.users, {_id: id});
  }

  getUserAvatar(id) {
    let userAvatar = this.getUser(id).avatar;
    if(userAvatar) {
      return userAvatar.base64;
    }
    return undefined;
  }

  findUsers(val) {
    return this.$http.get(`api/users/findByEmail/${val}`).then(function(response) {
      return response.data;
    });
  }

  removeUser(user) {
    if(user._id === this.project.owner._id) {
      return this.$log.error('مالک پروژه نمیتواند از پروژه حذف شود');
    }
    let index = _.findIndex(this.project.users, {_id: user._id});
    let patches = [
      {
        op: 'remove',
        path: `/users/${index}`
      }
    ];
    this.$http.patch(`api/projects/${this.project._id}`, patches)
      .then(project => {
        this.project.users = project.data.users;
        this.$http.post('api/projects/updateDefaultProject', user);
      });
  }

  addNewUser(newUser) {
    let oldUser = _.find(this.project.users, {_id: newUser._id});
    if(oldUser) {
      return this.$log.error('این کاربر قبلا عضو شده است');
    }
    this.$http.put(`api/projects/newUser/${this.project._id}`, newUser)
      .then(response => {
        this.users.push(newUser);
        this.project.users = response.data.users;
        this.newUser = null;
      })
      .catch((err) => {
        if(err.status === 400) {
          return this.$log.error(err.data);
        }
      });
  }
}

export default angular.module('reworkApp.project.manage', [uiRouter, typeahead, tooltip])
  .component('projectManage', {
    template: require('./project-manage.html'),
    require: {
      parentCom: '^project'
    },
    bindings: {
      project: '=',
      users: '<'
    },
    controller: projectManageComponent,
    controllerAs: 'vm'
  })
  .name;
