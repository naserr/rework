'use strict';
import angular from 'angular';
import uiRouter from 'angular-ui-router';

export class projectManageComponent {
  constructor() {
    'ngInject';
  }
}

export default angular.module('reworkApp.project.manage', [uiRouter])
  .component('projectManage', {
    template: require('./project-manage.html'),
    bindings: {project: '<'},
    controller: projectManageComponent,
    controllerAs: 'vm'
  })
  .name;
