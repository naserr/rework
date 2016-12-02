'use strict';
import angular from 'angular';
import uiRouter from 'angular-ui-router';
import zoomHtml from '../../../components/zoom-html';

export class projectDesktopComponent {
  zoomOptions = {
    target: '#target',
    minWidth: 80,
    minHeight: 100,
    maxWidth: 1600,
    maxHeight: 2000,
    animationFn: '.1s ease-out',
    transformOrigin: 'right top'
  };

  constructor($state, $stateParams, $log) {
    'ngInject';
    // $ocLazyLoad.load('assets/vendor/angular-zoom-directive/src/angular-zoom-directive.js');
    this.board = $stateParams.board.toUpperCase();
    let theBoard = this.project.boards.find(b => b.name.toUpperCase() === this.board);
    if(!theBoard) {
      $log.error('دسترسی غیر مجاز');
      $state.go('project.boards.list');
    }
  }
}

export default angular.module('reworkApp.project.desktop', [uiRouter, zoomHtml])
  .component('projectDesktop', {
    template: require('./project-desktop.html'),
    bindings: {project: '<'},
    controller: projectDesktopComponent,
    controllerAs: 'vm'
  })
  .name;
