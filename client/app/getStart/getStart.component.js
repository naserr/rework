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
    }).then(this.redirectToProject);
    this.projectName = '';
  }

  joinProject() {
    this.$http.post('/api/projects/join', {
      key: this.projectKey
    }).then(this.redirectToProject);
    this.projectKey = '';
  }

  redirectToProject = project => {
    project = project.data;
    return this.$state.go('project.detail', {id: project._id});
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
