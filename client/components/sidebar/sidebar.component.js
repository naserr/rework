'use strict';
/* eslint no-sync: 0 */

import angular from 'angular';

class SidebarComponent {

//   $onInit() {
//     this.parent.toggle = true;
//   }
//
//   toggleSidebar() {
//     this.parent.toggle = !this.parent.toggle;
//   }
}

export default angular.module('directives.sidebar', [])
  .component('sidebar', {
    // require: {
    //   parent: '^^app'
    // },
    template: require('./sidebar.html'),
    controller: SidebarComponent,
    controllerAs: 'sidebar'
  })
  .name;
