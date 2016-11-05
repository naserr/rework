import angular from 'angular';
import uiRouter from 'angular-ui-router';
import routing from './main.routes';

class MainController {

  /*@ngInject*/
  constructor($state, $http) {
    this.$http = $http;
    if(this.user.isFresh) {
      $state.go('app.getStart');
    } else if(this.user.defaultProject) {
      $state.go('app.project.detail', {id: this.user.defaultProject});
    } else {
      $state.go('app.project.list');
    }
  }
}

export default angular.module('reworkApp.main', [uiRouter])
  .config(routing)
  .component('mainState', {
    template: '',
    bindings: {
      user: '<'
    },
    controller: MainController
  })
  .name;
