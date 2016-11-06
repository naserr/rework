'use strict';

angular.module('reworkApp.landing', ['toastr'])
  .config(function(toastrConfig) {
    angular.extend(toastrConfig, {
      positionClass: 'toast-top-full-width',
      timeOut: 2000,
      allowHtml: true
    });
  })
  .controller('LandingController', LandingController);

function LandingController($http, toastr) {
  var vm = this;
  vm.message = {};
  vm.sendMessage = sendMessage;
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

  function resetMessage() {
    vm.message = {
      name: '',
      email: '',
      phone: '',
      text: ''
    };
  }
}
