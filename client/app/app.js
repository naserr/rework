'use strict';

import angular from 'angular';
// import ngAnimate from 'angular-animate';
import ngCookies from 'angular-cookies';
import ngResource from 'angular-resource';
import ngSanitize from 'angular-sanitize';
import 'angular-socket-io';

import uiRouter from 'angular-ui-router';

// import ngMessages from 'angular-messages';
// import ngValidationMatch from 'angular-validation-match';

import {routeConfig} from './app.config';

import _Auth from '../components/auth/auth.module';
import account from './account';
import admin from './admin';
import header from '../components/header/header.component';
import sidebar from '../components/sidebar/sidebar.component';
import constants from './app.constants';
import util from '../components/util/util.module';
import socket from '../components/socket/socket.service';
import main from './main/index';
import test from './test/index';

import './app.css';

angular.module('reworkApp', [ngCookies, ngResource, ngSanitize, 'btford.socket-io', uiRouter, _Auth,
    account, admin, constants, socket, util,
    main, header, sidebar, test
  ])
  .config(routeConfig)
  .config(routes)
  .component('app', {
    template: require('./app.html'),
    controller: AppComponent,
    controllerAs: 'app'
  })
  .run(function($rootScope, $location, Auth) {
    'ngInject';
    // Redirect to login if route requires auth and you're not logged in

    $rootScope.$on('$stateChangeStart', function(event, next) {
      Auth.isLoggedIn(function(loggedIn) {
        //noinspection JSUnresolvedVariable
        if(next.authenticate && !loggedIn) {
          $location.path('/login');
        }
      });
    });
  });

function routes($stateProvider) {
  'ngInject';

  $stateProvider
    .state('app', {
      url: '/',
      abstract: true,
      views: {
        'header@': {
          template: '<header></header>'
        },
        'sidebar@': {
          template: '<sidebar></sidebar>'
        },
        '@': {
          template: ''
        }
      }
    });
}

class AppComponent {
  toggle = true;
}

angular.element(document)
  .ready(() => {
    angular.bootstrap(document, ['reworkApp'], {
      strictDi: true
    });
  });
