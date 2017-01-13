'use strict';
import '../../../assets/vendor/bootstrap-jalali-datepicker/bootstrap-datepicker.min.css';
import '../../../assets/vendor/bootstrap-jalali-datepicker/bootstrap-datepicker.min';
import '../../../assets/vendor/bootstrap-jalali-datepicker/bootstrap-datepicker.fa.min';

export default class TaskController {
  project;
  newTask = {
    users: [],
    startDate: new Date(),
    endDate: new Date()
  };
  errors = {};

  constructor($scope, $q) {
    'ngInject';
    this.project = $scope.ngDialogData;
    this.$scope = $scope;
    this.$q = $q;
    this.projectUsers = _.filter(this.project.users, user => this.project.owner._id !== user._id);
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
    _.forEach(this.newTask.users, function(user) {
      user.isVisited = false;
    });
    this.project.tasks.push(this.newTask);
    this.newTask = {
      users: [],
      startDate: new Date(),
      endDate: new Date()
    };
    this.$scope.confirm(this.project);
  }
}
