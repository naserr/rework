'use strict';

export default function routes($stateProvider) {
  'ngInject';

  $stateProvider.state('login', {
      url: '/login',
      template: require('./login/login.html'),
      controller: 'LoginController',
      controllerAs: 'vm'
    })
    .state('logout', {
      url: '/logout?referrer',
      referrer: 'login',
      template: '',
      controller($state, Auth) {
        'ngInject';

        var referrer = $state.params.referrer || $state.current.referrer || 'login';
        Auth.logout();
        $state.go(referrer);
        // window.location.href = $state.href();
      }
    })
    .state('signup', {
      url: '/signup',
      template: require('./signup/signup.html'),
      controller: 'SignupController',
      controllerAs: 'vm'
    })
    .state('settings', {
      url: '/settings',
      template: require('./settings/settings.html'),
      controller: 'SettingsController',
      controllerAs: 'vm',
      authenticate: true
    });
}
