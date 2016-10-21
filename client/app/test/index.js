import angular from 'angular';
import uiRouter from 'angular-ui-router';
import routing from './test.routes';

export default angular.module('reworkApp.test', [uiRouter])
  .config(routing)
  .name;
