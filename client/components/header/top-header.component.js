'use strict';
/* eslint no-sync: 0 */

import angular from 'angular';

class HeaderController {
}

export default angular.module('directives.header', [])
  .component('topHeader', {
    template: require('./top-header.html'),
    controller: HeaderController
  })
  .name;
