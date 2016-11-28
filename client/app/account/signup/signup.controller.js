'use strict';

import angular from 'angular';

export default class SignupController {
  Auth;
  $state;
  user = {
    name: '',
    email: '',
    password: ''
  };
  errors = {};
  submitted = false;

  /*@ngInject*/
  constructor(Auth, $state) {
    this.Auth = Auth;
    this.$state = $state;
  }

  register(form) {
    this.submitted = true;

    if(form.$valid) {
      return this.Auth.createUser(
        {
          name: this.user.name,
          email: this.user.email,
          password: this.user.password
        }, null)
        .then(() => {
          this.Auth.getCurrentUser().then(user => {
            if(user.isFresh) {
              this.$state.go('getStart');
            } else if(user.defaultBoard) {
              this.$state.go('project.desktop', {id: user.defaultProject, board: user.defaultBoard});
            } else if(user.defaultProject) {
              this.$state.go('project.boards.list', {id: user.defaultProject});
            } else {
              this.$state.go('projects.list');
            }
          });
        })
        .catch(err => {
          err = err.data;
          this.errors = {};
          // Update validity of form fields that match the mongoose errors
          angular.forEach(err.errors, (error, field) => {
            form[field].$setValidity('mongoose', false);
            this.errors[field] = error.message;
          });
        });
    }
  }
}
