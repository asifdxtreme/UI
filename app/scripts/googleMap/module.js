'use strict';
angular.module('hcf.googleMap', [])
	.config(['$stateProvider', function($stateProvider) {
    $stateProvider
        .state('base.map', {
        	url: '/map',
        	views:{
        		'base' :{
		            templateUrl: 'scripts/googleMap/views/mapView.html',
		            controller: 'googleMaps as map'
        		}
        	}
        });
}]);