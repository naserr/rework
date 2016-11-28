'use strict';

export default class LoginController {
  Auth;
  $state;
  user = {
    name: '',
    email: '',
    password: ''
  };
  errors = {
    login: undefined
  };
  submitted = false;

  /*@ngInject*/
  constructor(Auth, $state) {
    this.Auth = Auth;
    this.$state = $state;
  }

  login(form) {
    this.submitted = true;

    if(form.$valid) {
      this.Auth.login(
        {
          email: this.user.email,
          password: this.user.password
        }, null)
        .then(() => {
          //noinspection Eslint
          let user = this.Auth.getCurrentUserSync();
          if(user.isFresh) {
            this.$state.go('getStart');
          } else if(user.defaultBoard) {
            this.$state.go('project.desktop', {id: user.defaultProject, board: user.defaultBoard});
          } else if(user.defaultProject) {
            this.$state.go('project.boards.list', {id: user.defaultProject});
          } else {
            this.$state.go('projects.list');
          }
        })
        .catch(err => {
          this.errors.login = err.message;
        });
    }
  }
}
