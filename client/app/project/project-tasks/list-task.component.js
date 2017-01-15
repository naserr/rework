'use strict';
import angular from 'angular';
import TaskController from './task.controller';

class ListTaskComponent {
  project;
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
    if(!this.selectedTask.users.length) {
      this.errors.users = true;
      return;
    }
    if(!this.selectedTask.description) {
      this.errors.description = true;
      return;
    }
    if(!this.selectedTask.title) {
      this.errors.title = true;
      return;
    }
    this.errors = {};

    let taskIndex = _.findIndex(this.project.tasks, t => t == this.selectedTask);
    let patches = [
      {
        op: 'replace',
        path: `/tasks/${taskIndex}`,
        value: this.selectedTask
      }
    ];
    this.$http.patch(`api/projects/patchTasks/${this.project._id}`, patches);
  }

  onTaskClicked(task) {
    this.selectedTask = task;
    let taskIndex = _.findIndex(this.project.tasks, t => t == task);
    let userIndex = _.findIndex(task.users, u => u._id == this.user._id);
    if(task.users[userIndex] && !task.users[userIndex].isVisited) {
      this.$http.put(`api/projects/toggleTaskVisited/${this.project._id}`, {
        taskIndex: taskIndex,
        userIndex: userIndex,
        isVisited: true
      });
    }
    if(userIndex === -1) {
      let patches = [
        {
          op: 'replace',
          path: `/tasks/${taskIndex}/isVisited`,
          value: true
        }
      ];
      this.$http.patch(`api/projects/patchTasks/${this.project._id}`, patches);
    }
  }

  isVisible(task) {
    return !!_.find(task.users, {
      _id: this.user._id
    });
  }

  isVisited(task) {
    let user = _.find(task.users, {_id: this.user._id});
    if(user) {
      return !user.isVisited;
    }
    return false;
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
