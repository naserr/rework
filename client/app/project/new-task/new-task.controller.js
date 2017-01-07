'use strict';
import 'ng-tags-input/build/ng-tags-input.min.css';
import 'ng-tags-input/build/ng-tags-input.bootstrap.min.css';
import '../../../assets/vendor/bootstrap-jalali-datepicker/bootstrap-datepicker.min.css';
import '../../../assets/vendor/bootstrap-jalali-datepicker/bootstrap-datepicker.min';
import '../../../assets/vendor/bootstrap-jalali-datepicker/bootstrap-datepicker.fa.min';

export default class NewTaskController {
  project;
  newTask = {
    users: [],
    date: new Date()
  };
  newUser;

  constructor($scope, $q) {
    'ngInject';
    this.project = $scope.ngDialogData;
    this.$q = $q;
    this.userNames = _.map(this.project.users, users => users.name);
  }

  users() {
    return this.$q.when(this.project.users);
  }

  addUser($tag) {
    let newUser = _.find(this.project.users, user => user._id === $tag._id && this.project.owner._id !== $tag._id);
    return !!newUser;
  }
}
