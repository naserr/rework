'use strict';

import merge from 'lodash/merge';
import moment from 'moment-jalaali';

export default class SettingsController {
  user = {
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  };
  errors = {
    other: undefined
  };
  message = '';
  submitted = false;

  /*@ngInject*/
  constructor(Auth) {
    this.Auth = Auth;
    moment.loadPersian();
    this.user.expire = moment(this.user.expire).fromNow();
    merge(this.user, Auth.getCurrentUserSync());
  }

  changePassword(form) {
    this.submitted = true;

    if(form.$valid) {
      this.Auth.changePassword(this.user.oldPassword, this.user.newPassword)
        .then(() => {
          this.message = 'Password successfully changed.';
        })
        .catch(() => {
          form.password.$setValidity('mongoose', false);
          this.errors.other = 'Incorrect password';
          this.message = '';
        });
    }
  }
}
