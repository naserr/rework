import angular from 'angular';
import uiRouter from 'angular-ui-router';
import routing from './main.routes';

class MainController {

  /*@ngInject*/
  constructor($state, $http) {
    this.$http = $http;
    if(this.user.isFresh) {
      $state.go('app.getStart');
    }
    else if(this.user.defaultProject) {
      $state.go('app.project.detail', {id: this.user.defaultProject});
    } else {
      $state.go('app.project.list');
    }
  }

  delete() {
    this.$http.delete(`/api/projects/${this.user.defaultProjec || '1'}`);
  }
}

export default angular.module('reworkApp.main', [uiRouter])
  .config(routing)
  .component('main', {
    template: require('./main.html'),
    bindings: {
      user: '<'
    },
    controller: MainController
  })
  .name;
