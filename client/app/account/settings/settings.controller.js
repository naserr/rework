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
  constructor(Auth, $rootScope, $http) {
    this.Auth = Auth;
    this.$http = $http;
    this.$rootScope = $rootScope;
    moment.loadPersian();
    this.user.expire = moment(this.user.expire).fromNow();
    merge(this.user, Auth.getCurrentUserSync());
    this.action = `/api/users/${this.user._id}/settings`;
  }

  resetProfile() {
    this.$http.patch(`api/users/${this.user._id}/`);
  }

  saveSettings(form) {
    this.submitted = true;

    if(form.$valid) {
      this.Auth.saveSettings(this.user)
        .then(() => {
          this.$rootScope.$broadcast('AVATAR_CHANGED', this.user);
          this.message = 'رمز عبور اشتباه است';
        })
        .catch(() => {
          form.password.$setValidity('mongoose', false);
          this.errors.other = 'رمز عبور اشتباه است';
          this.message = '';
        });
    }
  }
}
