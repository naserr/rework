'use strict';

export default function routes($stateProvider) {
  'ngInject';

  $stateProvider
    .state('app.main', {
      url: '',
      authenticate: true,
      views: {
        '@': {
          template: '<main-state user="$resolve.user"></main-state>',
          resolve: {
            /*@ngInject*/
            user: Auth => Auth.getCurrentUser()
          }
        }
      }
    });
}
