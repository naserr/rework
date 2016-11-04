'use strict';
import angular from 'angular';

export function routeConfig($urlRouterProvider, $locationProvider) {
  'ngInject';

  $urlRouterProvider.otherwise('/');

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
        if(rejection.status === 401 && rejection.config.url === '/api/users/me') {
          return $q.reject(rejection);
        }
        if(typeof error === 'object' || _.isEmpty(error)) {
          errorMessage = 'درخواست با خطا مواجه شد';
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
        toastr.error(e);
      }
      errorFn.apply(null, arguments);
    };

    var warnFn = $delegate.warn;
    $delegate.warn = function(e, showToast = true) {
      let toastr = $injector.get('toastr');
      if(showToast) {
        toastr.warning(e);
      }
      warnFn.apply(null, arguments);
    };

    var infoFn = $delegate.info;
    $delegate.info = function(e, showToast = true) {
      let toastr = $injector.get('toastr');
      if(showToast) {
        toastr.info(e);
      }
      infoFn.apply(null, arguments);
    };

    $delegate.success = function(e, showToast = true) {
      let toastr = $injector.get('toastr');
      if(showToast) {
        toastr.success(e);
      }
      $delegate.log(e);
    };

    return $delegate;
  }
}
