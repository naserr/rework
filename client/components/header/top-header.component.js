'use strict';
/* eslint no-sync: 0 */

import angular from 'angular';

class HeaderController {
  toggleSidebar() {
    this.project.isOpen = !this.project.isOpen;
  }
}

export default angular.module('directives.header', [])
  .component('topHeader', {
    require: {
      project: '^^project'
    },
    template: require('./top-header.html'),
    controller: HeaderController
  })
  .name;
