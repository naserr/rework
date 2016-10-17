'use strict';

export default function routes($stateProvider) {
  'ngInject';

  $stateProvider.state('main', {
    url: '/',
    template: '<navbar></navbar><main></main><footer></footer>',
    authenticate: true
  });
}
