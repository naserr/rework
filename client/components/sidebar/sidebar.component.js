'use strict';
/* eslint no-sync: 0 */

import angular from 'angular';

export default angular.module('directives.sidebar', [])
  .component('sidebar', {
    template: require('./sidebar.html'),
    bindings: {
      project: '<'
    }
  })
  .name;
