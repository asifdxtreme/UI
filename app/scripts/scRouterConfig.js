'use strict';
angular.module('serviceCenter.router', [])
	.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/sc/services');
    $stateProvider
        .state('sc', {
            url: '/sc',
            templateUrl: 'views/base.html'
        })
         .state('sc.services', {
            url: '/services',
            views:{
                'base' :{
                    templateUrl: 'scripts/serviceCenter/views/index.html',
                    controller: 'serviceListController as services'
                }
            }
        })
        .state('error', {
        	url: '/error',
        	templateUrl: 'views/error.html'
        });
}]);