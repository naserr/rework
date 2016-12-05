'use strict';
import angular from 'angular';

export function routeConfig($urlRouterProvider, $locationProvider) {
  'ngInject';

  $urlRouterProvider.otherwise('/');

  $urlRouterProvider.when('/', '/login');

  $locationProvider.html5Mode(true);
}

export function toastrConfig(toastrConfig) {
  'ngInject';

  angular.extend(toastrConfig, {
    autoDismiss: false,
    containerId: 'toast-container',
    maxOpened: 0,
    newestOnTop: true,
    positionClass: 'toast-top-full-width',
    preventDuplicates: false,
    preventOpenDuplicates: false,
    target: 'body'
  });

  angular.extend(toastrConfig, {
    allowHtml: true,
    closeButton: false,
    closeHtml: '<button>&times;</button>',
    extendedTimeOut: 1000,
    iconClasses: {
      error: 'toast-error',
      info: 'toast-info',
      success: 'toast-success',
      warning: 'toast-warning'
    },
    messageClass: 'toast-message',
    progressBar: false,
    tapToDismiss: true,
    timeOut: 3000,
    titleClass: 'toast-title',
    toastClass: 'toast'
  });
}

export function interceptorConfig($httpProvider) {
  'ngInject';

  /*@ngInject*/
  $httpProvider.interceptors.push(function($q, $log) {
    return {
      responseError(rejection) {
        let error = rejection.data;
        let errorMessage = error;
        if(rejection.status === 401) {
          if(rejection.config.url === '/api/users/me') {
            return $q.reject(rejection);
          } else {
            errorMessage = 'دسترسی غیرمجاز';
          }
        }
        if(typeof error === 'object' && !_.isEmpty(error)) {
          if(error.errors && typeof error.errors === 'object' && !_.isEmpty(error.errors)) {
            for(var errKey in error.errors) {
              if(error.errors.hasOwnProperty(errKey)) {
                let err = error.errors[errKey];
                $log.error(err.message);
              }
            }
            return $q.reject(rejection);
          }
          errorMessage = error.message || 'درخواست با خطا مواجه شد';
        } else {
          errorMessage = error.message || 'درخواست با خطا مواجه شد';
        }
        $log.error(errorMessage);
        return $q.reject(rejection);
      }
    };
  });
}

export function logDecorator($provide) {
  'ngInject';

  $provide.decorator('$log', decorator);

  function decorator($delegate, $injector) {
    'ngInject';

    var errorFn = $delegate.error;
    $delegate.error = function(e, showToast = true) {
      let toastr = $injector.get('toastr');
      if(showToast) {
        toastr.error(`<div style="direction: rtl">${e}</div>`);
      }
      errorFn.apply(null, arguments);
    };

    var warnFn = $delegate.warn;
    $delegate.warn = function(e, showToast = true) {
      let toastr = $injector.get('toastr');
      if(showToast) {
        toastr.warning(`<div style="direction: rtl">${e}</div>`);
      }
      warnFn.apply(null, arguments);
    };

    var infoFn = $delegate.info;
    $delegate.info = function(e, showToast = true) {
      let toastr = $injector.get('toastr');
      if(showToast) {
        toastr.info(`<div style="direction: rtl">${e}</div>`);
      }
      infoFn.apply(null, arguments);
    };

    $delegate.success = function(e, showToast = true) {
      let toastr = $injector.get('toastr');
      if(showToast) {
        toastr.success(`<div style="direction: rtl">${e}</div>`);
      }
      $delegate.log(`<div style="direction: rtl">${e}</div>`);
    };

    return $delegate;
  }
}
