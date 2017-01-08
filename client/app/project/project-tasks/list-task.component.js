'use strict';
import angular from 'angular';
import uiRouter from 'angular-ui-router';

class ListTaskComponent {
  constructor() {
    'ngInject';
    console.log('list-task...');
  }
}

export default angular.module('reworkApp.project.task', [])
  .component('list-task', {
    template: require('./list-task.html'),
    bindings: {project: '='},
    controller: ListTaskComponent,
    controllerAs: 'vm'
  })
  .name;
