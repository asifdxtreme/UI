'use strict';
angular.module('serviceCenter.router', [])
	.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/sc/services');
    $stateProvider
        .state('sc', {
            url: '/sc',
            abstract: true,
            templateUrl: 'views/base.html'
        })
        .state('sc.allServices', {
            url: '/services',
            views:{
                'base' :{
                    templateUrl: 'scripts/serviceCenter/views/index.html',
                    controller: 'servicesListController as services'
                }
            }
        })
        .state('sc.allInstances', {
            url: '/instances',
            views:{
                'base' :{
                    templateUrl: 'scripts/instances/views/index.html',
                    controller: 'instancesListController as instances',       
                }    
            },
            resolve: {
                servicesList: ['$q','httpService','apiConstant',function($q,httpService,apiConstant){
                    var deferred = $q.defer();
                    var url = apiConstant.api.microservice.url;
                    var method = apiConstant.api.microservice.method;
                    httpService.apiRequest(url,method).then(function(response){
                        if(response && response.data && response.data.services){
                            deferred.resolve(response.data.services);
                        }
                        else {
                            deferred.resolve([]);
                        }
                    },function(error){
                        deferred.reject(error);
                    });
                    return deferred.promise;
                }]
            }
        })
        // .state('sc.instances',{
        //     url: '/:serviceId',
        //     views: {
        //         'base': {
        //             templateUrl: 'scripts/serviceCenter/views/serviceInfo.html',
        //             controller: 'serviceInfoController as serviceInfo'
        //         }
        //     }
        // })
        .state('error', {
        	url: '/error',
        	templateUrl: 'views/error.html'
        });
}]);