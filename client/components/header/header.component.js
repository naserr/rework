'use strict';
/* eslint no-sync: 0 */

import angular from 'angular';

class HeaderController {
}

export default angular.module('directives.header', [])
  .component('header', {
    template: require('./header.html'),
    controller: HeaderController
  })
  .name;
