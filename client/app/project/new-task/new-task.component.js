'use strict';
import angular from 'angular';
import uiRouter from 'angular-ui-router';
import ngDialog from 'ng-dialog';

export class NewTaskComponent {
  constructor() {
    'ngInject';
    console.log(' new task component ', this.project);
  }
}

export default angular.module('reworkApp.project.newTask', [uiRouter, ngDialog])
  .component('newTask', {
    template: require('./new-task.html'),
    bindings: {project: '='},
    controller: NewTaskComponent,
    controllerAs: 'vm'
  })
  .name;
