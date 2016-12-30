'use strict';

import angular from 'angular';
import ngCookies from 'angular-cookies';
import ngResource from 'angular-resource';
import ngSanitize from 'angular-sanitize';
import 'angular-socket-io';
import toastr from 'angular-toastr';
import uiRouter from 'angular-ui-router';
import angularstrap from 'angular-strap';
// import ngAnimate from 'angular-animate';
// import 'oclazyload';

// import ngMessages from 'angular-messages';
// import ngValidationMatch from 'angular-validation-match';

import * as appConfig from './app.config';

import _Auth from '../components/auth/auth.module';
import account from './account';
import admin from './admin';
import header from '../components/header/top-header.component';
import sidebar from '../components/sidebar/sidebar.component';
import constants from './app.constants';
import util from '../components/util/util.module';
import socket from '../components/socket/socket.service';
import getStart from './get-start/get-start.component';
import project from './project/index';
import projectsList from './projects-list/projects-list.component';

import './app.css';

angular.module('reworkApp', [ngCookies, ngResource, ngSanitize, 'btford.socket-io', 'draggabilly', /*'oc.lazyLoad',*/
  'naif.base64', uiRouter, toastr, _Auth, account, admin, constants, socket, util, header, sidebar, 'ngAnimate', 'mgcrea.ngStrap',
    getStart, project, projectsList
  ])
  .config(appConfig.routeConfig)
  .config(appConfig.toastrConfig)
  .config(appConfig.logDecorator)
  .config(appConfig.interceptorConfig)
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

angular.element(document)
  .ready(() => {
    angular.bootstrap(document, ['reworkApp'], {
      strictDi: true
    });
  });
