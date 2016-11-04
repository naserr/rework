'use strict';
import angular from 'angular';
import uiRouter from 'angular-ui-router';
import routes from './getStart.routes';

class GetStartComponent {
  projectName = '';
  projectKey = '';

  /*@ngInject*/
  constructor($http) {
    this.$http = $http;
  }

  createProject() {
    this.$http.post('/api/projects', {
      name: this.projectName
    });
    this.projectName = '';
  }

  joinProject() {
    this.$http.post('/api/projects/join', {
      key: this.projectKey
    });
    this.projectKey = '';
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
