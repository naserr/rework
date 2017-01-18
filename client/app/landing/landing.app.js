'use strict';

angular.module('reworkApp.landing', ['toastr', 'duScroll'])
  .value('duScrollBottomSpy', true)
  .config(function(toastrConfig) {
    //noinspection ES6ModulesDependencies
    angular.extend(toastrConfig, {
      positionClass: 'toast-top-full-width',
      timeOut: 2000,
      allowHtml: true
    });
  })
  .controller('LandingController', LandingController);

function LandingController($http, toastr) {
  //noinspection Eslint
  var vm = this;
  vm.message = {};
  vm.sendMessage = sendMessage;
  vm.subscribe = subscribe;
  resetMessage();

  function sendMessage(form, message) {
    $http.post('api/contacts', message).then(function() {
      form.$setPristine(true);
      resetMessage();
      toastr.success('پیام شما با موفقیت ارسال شد');
    }, function(error) {
      toastr.error('لطفا دوباره سعی کنید');
      console.log('submit new contact', error);
    });
  }

  function subscribe(form, email) {
    //noinspection Eslint
    $http.post('api/subscriptions', {email: email}).then(function() {
      form.$setPristine(true);
      vm.subscribeEmail = '';
      toastr.success('با موفقیت انجام شد');
    }, function(error) {
      var errorMessage = 'دوباره سعی کنید';
      if(error.status === 400) {
        errorMessage = error.data || errorMessage;
      }
      toastr.error(errorMessage);
      console.log('subscribe', error);
    });
  }

  function resetMessage() {
    vm.message = {
      name: '',
      email: '',
      phone: '',
      text: ''
    };
  }
}
