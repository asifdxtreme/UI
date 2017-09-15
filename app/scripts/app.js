'use strict';

/**
 * @ngdoc overview
 * @name sourceFedrationApp
 * @description
 * # Huawei Cloud Fedration
 * Graphical representation of the cloud Data Center over Google Maps 
 *
 * Main module of the application.
 */
angular.module('serviceCenter', ['ngAnimate', 'ngMaterial', 'ngAria', 'ngCookies', 'ngMessages', 'ngResource', 'ngRoute', 'ngSanitize', 'ui.router', 
    'ngMdIcons', 'pascalprecht.translate', 'serviceCenter.router','md.data.table'])
  .config(['$translateProvider', function($translateProvider) {
        $translateProvider.useSanitizeValueStrategy(null);
        $translateProvider.useStaticFilesLoader({
            files: [{
                prefix: 'scripts/languages/locale-',
                suffix: '.json'
            }]
        });
        $translateProvider.preferredLanguage('en');
    }])
  .config(['$httpProvider', function($httpProvider) {
        $httpProvider.defaults.useXDomain = true;
        delete $httpProvider.defaults.headers.common['X-Requested-With'];
    }])
  .run(['$state', '$cookies', '$rootScope', function($state, $cookies, $rootScope) {
    $rootScope.$on('$stateChangeStart', function(e, toState/*, toParams, fromState, fromParams*/) {
        /* May be when the auth is implemented we can use this 
        if (toState.name.indexOf('tool') > -1 && !$cookies.Session) {
            // If logged out and transitioning to a logged in page:
            e.preventDefault();
            $state.go('');
        } else if (toState.name.indexOf('public') > -1 && $cookies.Session) {
            // If logged in and transitioning to a logged out page:
            e.preventDefault();
            $state.go('');
        };*/
    });
}]);
