'use strict';

import angular from 'angular';
import {
  UtilService
} from './util.service';

export default angular.module('reworkApp.util', [])
  .factory('Util', UtilService)
  .directive('mongooseError', function() {
    return {
      restrict: 'A',
      require: 'ngModel',
      link(scope, element, attrs, ngModel) {
        element.on('keydown', () => ngModel.$setValidity('mongoose', true));
      }
    };
  })
  .name;
