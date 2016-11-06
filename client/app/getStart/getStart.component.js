'use strict';
import angular from 'angular';
import uiRouter from 'angular-ui-router';
import routes from './getStart.routes';

class GetStartComponent {
  projectName = '';
  projectKey = '';

  /*@ngInject*/
  constructor($http, $state) {
    this.$http = $http;
    this.$state = $state;
  }

  createProject() {
    this.$http.post('/api/projects', {
      name: this.projectName
    }).then(p => {
      console.log('prohect > ', p.data);
      return this.$state.go('app.project.detail', {id: p.data.defaultProject});
    });
    this.projectName = '';
  }

  joinProject() {
    this.$http.post('/api/projects/join', {
      key: this.projectKey
    }).then(p => {
      console.log('prohect > ', p.data);
      return this.$state.go('app.project.detail', {id: p.data.defaultProject});
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
