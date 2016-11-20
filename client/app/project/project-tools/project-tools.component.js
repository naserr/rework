'use strict';
import angular from 'angular';
import uiRouter from 'angular-ui-router';
import routes from './projectTools.routes';

export class projectToolsComponent {
  constructor($http, $scope, $state, $stateParams) {
    /*@ngInject*/
  }
}
export default angular.module('reworkApp.projectTools', [uiRouter])
  .config(routes)
  .component('projectTools', {
    controller: projectToolsComponent,
    controllerAs: 'vm'
  })
  .name;

