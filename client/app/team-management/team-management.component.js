'use strict';
import angular from 'angular';
import uiRouter from 'angular-ui-router';
import routes from './team-management.routes';

class teamManagementComponent {
  projectName = '';
projectKey = '';

/*@ngInject*/

}

export default angular.module('reworkApp.teamManagement', [uiRouter])
  .config(routes)
  .component('teamManagement', {
  template: require('./team-management.html'),
  controller: teamManagementComponent,
  controllerAs: 'manage'
})
  .name;
