import angular from 'angular';
import uiRouter from 'angular-ui-router';
import routing from './main.routes';

export class MainController {
  time = new Date();

  /*@ngInject*/
  constructor($interval) {
    $interval(this.countUp.bind(this), 1000);
  }

  countUp() {
    this.time = new Date();
  }
}

export default angular.module('reworkApp.main', [uiRouter])
  .config(routing)
  .name;
