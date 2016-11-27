'use strict';
/* eslint no-sync: 0 */

import angular from 'angular';

class HeaderController {

  $onInit() {
    // this.parent.toggle = true;
  }

  toggleSidebar() {
    console.log(12);
    // this.parent.toggle = !this.parent.toggle;
  }
}

export default angular.module('directives.header', [])
  .component('topHeader', {
  template: require('./top-header.html'),
  controller: HeaderController
})
  .name;
