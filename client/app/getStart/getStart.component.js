'use strict';
import angular from 'angular';
import uiRouter from 'angular-ui-router';
import routes from './getStart.routes';

class GetStartComponent {
  projectName = '';
  projectKey = '';

  /*@ngInject*/
  constructor() {
    this.projectName = 'Hello';
    this.projectKey = 123;
  }
}

export default angular.module('reworkApp.getStart', [uiRouter])
  .config(routes)
  .component('getStart', {
    template: require('./getStart.html'),
    controller: GetStartComponent,
    controllerAs: 'vm'
  })
  .name;
