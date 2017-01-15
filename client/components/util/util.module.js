'use strict';

import angular from 'angular';
import moment from 'moment-jalaali';
import {
  UtilService
} from './util.service';

moment.loadPersian();

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
  .directive('datePicker', function($parse) {
    'ngInject';
    return {
      restrict: 'AE',
      replace: true,
      transclude: false,
      link: function(scope, element, attrs) {
        var modelAccessor = $parse(attrs.datePicker);

        // var html = '<input type="text" id="' + attrs.id + '" ></input>';
        // var newElem = $(html);
        // element.replaceWith(newElem);

        var processChange = function() {
          var date = new Date(element.datepicker('getDate').getGregorianDate());

          scope.$apply(function(scope) {
            modelAccessor.assign(scope, date);
          });
          element.blur();
        };

        element.datepicker({
          dateFormat: 'dd MM',
          onClose: processChange,
          onSelect: processChange
        });
        scope.$watch(modelAccessor, function(val) {
          var date = new Date(val);
          element.datepicker('setDate', date);
        });
      }
    };
  })
  .directive('ngEnter', function() {
    return function(scope, element, attrs) {
      element.bind("keydown keypress", function(event) {
        if(event.which === 13) {
          scope.$apply(function() {
            scope.$eval(attrs.ngEnter);
          });

          event.preventDefault();
        }
      });
    };
  })
  .filter('jalaaliDate', function filter() {
    return function(inputDate, format) {
      var date = moment(inputDate);
      return date.format(format);
    };
  })
  .name;
