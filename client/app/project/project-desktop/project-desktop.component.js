'use strict';
import angular from 'angular';
import uiRouter from 'angular-ui-router';

export class projectDesktopComponent {
  constructor($stateParams) {
    'ngInject';
    console.log(`project ${this.project}`);
    console.log(`board ${$stateParams.board}`);
  }
}

export default angular.module('reworkApp.project.desktop', [uiRouter])
  .component('projectDesktop', {
    template: require('./project-desktop.html'),
    bindings: {project: '<'},
    controller: projectDesktopComponent,
    controllerAs: 'vm'
  })
  .name;
