'use strict';
import angular from 'angular';
import TaskController from './task.controller';

class ListTaskComponent {
  project;
  newTask = {
    users: [],
    startDate: new Date(),
    endDate: new Date()
  };
  errors = {};

  constructor($scope, $q, $http, Auth, ProjectAuth) {
    'ngInject';
    this.$scope = $scope;
    this.$q = $q;
    this.$http = $http;
    this.projectUsers = _.filter(this.project.users, user => this.project.owner._id !== user._id);

    this.user = Auth.getCurrentUserSync();
    this.isOwner = ProjectAuth.hasAccess(this.project, 'admin');
  }

  users() {
    return this.$q.when(this.projectUsers);
  }

  addUser($tag) {
    let newUser = _.find(this.project.users, user => user._id === $tag._id && this.project.owner._id !== $tag._id);
    if(!!newUser) {
      this.errors.users = false;
    }
    return !!newUser;
  }

  saveTask() {
    if(!this.newTask.users.length) {
      this.errors.users = true;
      return;
    }
    if(!this.newTask.description) {
      this.errors.description = true;
      return;
    }
    if(!this.newTask.title) {
      this.errors.title = true;
      return;
    }
    this.errors = {};
    this.project.tasks.push(this.newTask);
    this.newTask = {
      users: [],
      startDate: new Date(),
      endDate: new Date()
    };
    this.$scope.confirm(this.project);
  }

  deleteTask(task) {
    let index = _.findIndex(this.project.tasks, t => t == task);
    let patches = [
      {
        op: 'remove',
        path: `/tasks/${index}`
      }
    ];
    this.$http.patch(`api/projects/${this.project._id}`, patches)
      .then(pr => {
        this.project.tasks = pr.data.tasks;
        this.selectedTask = null;
      });
  }
}

export default angular.module('reworkApp.project.task', [])
  .component('listTask', {
    template: require('./list-task.html'),
    bindings: {project: '='},
    controller: ListTaskComponent,
    controllerAs: 'vm'
  })
  .controller('TaskController', TaskController)
  .name;
