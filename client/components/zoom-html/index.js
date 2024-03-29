'use strict';

import angular from "angular";

function ZoomHtmlController($scope) {
  'ngInject';
  this.in = function() {
    if($scope.currentStep < $scope.stepCnt) {
      $scope.currentStep += 1;
    }
  };
  this.out = function() {
    if($scope.currentStep > 0) {
      $scope.currentStep -= 1;
    }
  };
  this.isMaxedIn = function() {
    return $scope.currentStep == $scope.steps.length - 1;
  };
  this.isMaxedOut = function() {
    return $scope.currentStep == 0;
  };
}

export default angular.module('reworkApp.zoomHtml', [])
  .directive('zoomHtml', function($window, $document) {
    'ngInject';
    return {
      restrict: 'EA',
      replace: true,
      transclude: true,
      template: '<div class="zoom-html"></div>',
      scope: {},
      controller: ZoomHtmlController,
      controllerAs: 'zoom',
      link: function linkFunction($scope, ele, attrs, controller, transclude) {
        var options = $scope.$eval(attrs.zoomHtml) || {};
        var eleTarget = $document[0].querySelector(options.target);
        $scope.$watch(function() {
          return [eleTarget.clientWidth, eleTarget.clientHeight];
        }, calc, true);
        $window.addEventListener('resize', calc);
        function calc() {
          var eleControls = ele[0];
          var steps = $scope.steps = [];
          var stepCnt = $scope.stepCnt = options.stepCnt || 4;
          var animation = options.animationFn || '.7s ease-out';
          var transformOrigin = options.transformOrigin || 'center top';
          var minHeight = options.minHeight;
          var minWidth = options.minWidth;
          var maxHeight = options.maxHeight;
          var maxWidth = options.maxWidth;
          // var min = options.min;
          // var max = options.max;
          var minWidthOffset = options.minWidthOffset || 0;
          var minHeightOffset = options.minHeightOffset || 0;
          var maxWidthOffset = options.maxWidthOffset || 0;
          var maxHeightOffset = options.maxHeightOffset || 0;
          // var offsetX = options.offsetX || 0;

          if(minWidth === 'initial') {
            minWidth = eleTarget.clientWidth;
          }

          if(minHeight === 'initial') {
            minHeight = eleTarget.clientHeight;
          }

          if(minWidth === 'window') {
            minWidth = $window.innerWidth;
          }

          if(minHeight === 'window') {
            minHeight = $window.innerHeight;
          }

          if(maxWidth === 'initial') {
            maxWidth = eleTarget.clientWidth;
          }

          if(maxHeight === 'initial') {
            maxHeight = eleTarget.clientHeight;
          }

          if(maxWidth === 'window') {
            maxWidth = $window.innerWidth;
          }

          if(maxHeight === 'window') {
            maxHeight = $window.innerHeight;
          }

          // minHeight += minWidthOffset;
          minWidth += minWidthOffset;
          minHeight += minHeightOffset;
          maxWidth += maxWidthOffset;
          maxHeight += maxHeightOffset;

          transclude($scope, function(nodes) {
            angular.element(eleControls).html('')
              .append(nodes);
          });

          $scope.currentStep = calculateSteps();

          applyTransformOrigin(eleTarget, transformOrigin);

          $scope.$watch('currentStep', function(currentStep, oldStep) {
            if(currentStep !== oldStep) {
              applyAnimation(eleTarget, animation);
            }
            applyTransform(eleTarget, steps[currentStep]);
          });

          function calculateSteps() {
            var width = eleTarget.clientWidth;
            var height = eleTarget.clientHeight;
            var minWidthScale = minWidth / width || -Infinity;
            var minHeightScale = minHeight / height || -Infinity;
            var maxWidthScale = maxWidth / width || Infinity;
            var maxHeightScale = maxHeight / height || Infinity;
            var minScale = Math.max(minWidthScale, minHeightScale);
            var maxScale = Math.min(maxWidthScale, maxHeightScale);
            var minLog = Math.log(minScale);
            var maxLog = Math.log(maxScale);

            if(minScale > 1 || maxScale < 1) {
              steps.push(1);
            } else {
              // var x = stepCnt * minLog / (maxLog - minLog);
              var initalStep = Math.round(stepCnt * -minLog / (maxLog - minLog));

              for(var i = 0; i <= stepCnt; i++) {
                var step;
                if(i < initalStep) {
                  step = -minLog / initalStep * i + minLog;
                } else if(i > initalStep) {
                  step = maxLog * (i - initalStep) / (stepCnt - initalStep);
                } else {
                  step = 0;
                }
                steps.push(Math.pow(Math.E, step));
              }
            }
            return steps.indexOf(1);
          }

          function applyTransformOrigin(element, cssValue) {
            element.style.transformOrigin = cssValue;
            element.style.webkitTransformOrigin = cssValue;
            element.style.mozTransformOrigin = cssValue;
            element.style.msTransformOrigin = cssValue;
            element.style.oTransformOrigin = cssValue;
            return element.style.oTransformOrigin;
          }

          function applyTransform(element, value) {
            // var cssValue = 'scale(' + value + ',' + value + ')';
            var cssValue = `scale(${value}, ${value})`;
            element.style.transform = cssValue;
            element.style.webkitTransform = cssValue;
            element.style.mozTransform = cssValue;
            element.style.msTransform = cssValue;
            element.style.oTransform = cssValue;
            return element.style.oTransform;
          }

          function applyAnimation(element, cssValue) {
            element.style.transition = cssValue;
            element.style.webkitTransition = cssValue;
            element.style.mozTransition = cssValue;
            element.style.oTransition = cssValue;
            return element.style.oTransition;
          }
        }
      }
    };
  })
  .name;
