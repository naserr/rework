import angular from 'angular';
import uiRouter from 'angular-ui-router';
import routing from './main.routes';

class MainController {

  /*@ngInject*/
  constructor($state) {
    if(this.user.isFresh) {
      $state.go('app.getStart');
    }
  }
}

export default angular.module('reworkApp.main', [uiRouter])
  .config(routing)
  .component('main', {
    template: '',
    bindings: {
      user: '<'
    },
    controller: MainController
  })
  .name;
