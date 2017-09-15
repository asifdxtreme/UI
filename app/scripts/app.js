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
angular.module('serviceCenter', ['ngAnimate', 'ngMaterial', 'ngAria', 'ngMessages', 'ngResource', 'ngRoute', 'ngSanitize', 'ui.router', 
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
  .config(['$httpProvider','$injector', function($httpProvider,$injector) {
        $httpProvider.defaults.useXDomain = true;
        delete $httpProvider.defaults.headers.common['X-Requested-With'];
        
        $injector.invoke(['$qProvider', function($qProvider) {
            $qProvider.errorOnUnhandledRejections(false);
        }]);
    }]);
 
