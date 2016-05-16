'use strict';
angular.module('hcf.base', [])
	.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/hcf/map');
    $stateProvider
        .state('base', {
            url: '/hcf',
            templateUrl: 'views/base.html',
            controller: 'baseController as base'
        })
        .state('error', {
        	url: '/error',
        	templateUrl: 'views/error.html'
        });
}]);