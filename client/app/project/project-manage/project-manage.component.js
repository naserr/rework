'use strict';
import angular from 'angular';
import uiRouter from 'angular-ui-router';

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

  constructor($http) {
    'ngInject';
    this.$http = $http;
  }

  getUser(id) {
    return _.find(this.users, {_id: id});
  }

  removeUser(user) {
    let index = _.findIndex(this.project.users, {_id: user._id});
    let patches = [
      {
        op: 'remove',
        path: `/users/${index}`
      }
    ];
    this.$http.patch(`api/projects/${this.project._id}`, patches)
      .then(project => {
        this.project.users = project.users;
      });
  }
}

export default angular.module('reworkApp.project.manage', [uiRouter])
  .component('projectManage', {
    template: require('./project-manage.html'),
    bindings: {
      project: '=',
      users: '<'
    },
    controller: projectManageComponent,
    controllerAs: 'vm'
  })
  .name;
