'use strict';

export default function routes($stateProvider) {
  'ngInject';

  $stateProvider
    .state('app.main', {
      url: '',
      authenticate: true,
      views: {
        '@': {
          template: '<main user="$resolve.user"></main>',
          resolve: {
            /*@ngInject*/
            user: Auth => {
              return Auth.getCurrentUser();
            }
          }
        }
      }
    });
}
