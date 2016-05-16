'use strict';
angular.module('hcf.googleMap')
	.service('mapServices', ['$q', 'ajaxService', 'api', function($q, ajaxService, api){

		this.fetchLatency = function(endPoint, queriedDc){
			var defer = $q.defer();
			var latency = ajaxService.call(endPoint+'LATENCY', 'GET', null);
			latency.then(function(response){
				if(response.data !== "null"){
					response.data.queriedDc = queriedDc;
				}				
				defer.resolve(response.data);
			}, function(error){
				error.queriedDc = queriedDc;
				defer.resolve(error);
			});
			return defer.promise;
		};

		this.getDCList = function (){
			var defer = $q.defer();
			var dcList = ajaxService.call(api.endPoint.url + api.dcBootstrap.url, api.dcBootstrap.method, null);
			dcList.then(function(data){
				defer.resolve(data);
			},function(error){
				defer.reject(error);
				console.log(error);
			});

			/*var data = {
				'data' : [
	                {
	                    'City': 'Bangalore',
	                    'Country' : 'India',
	                    'EndPoint' : 'http://192.168.1.1/v1/'
	                },
	                {
	                    'City': 'Shenzhen',
	                    'Country' : 'China',
	                    'EndPoint' : 'http://192.168.1.1/v1/'
	                },
	                {
	                    'City': 'Hangzhou',
	                    'Country' : 'China',
	                    'EndPoint' : 'http://192.168.1.1/v1/'
	                }
	            ]
			};
			defer.resolve(data);*/
			return defer.promise;
		};

		this.getGeoLocation = function(dcList){
			var defer = $q.defer();
			var dcLocations = [], len = dcList.length;
			for(var i = 0; i < len; i++){
				var currentDC = dcList[i].City + ', ' + dcList[i].Country;
				dcLocations.push(this.getGeoLatLng(currentDC, dcList[i].EndPoint, dcList[i].Name));
			}
			$q.all(dcLocations).then(function(data){
				//Check for errors in the response
				for(var i = 0; i < data.length; i++){
					if(false === data[i]){
						data.splice(1 , i);
					}
				}
				defer.resolve(data);
			}, function(error){
				defer.reject(error);
			});
			return defer.promise;
		};

		this.getGeoLatLng = function(currentDC, endPoint, name){
			var defer = $q.defer();
			var geocoder = new google.maps.Geocoder();
			var data = [currentDC, endPoint, name];
			geocoder.geocode({'address' : currentDC}, function(result, status){
				console.log(result);
				//Result has a object geometry that has location, you can use the location as is or get the lat lng 
				if(status === google.maps.GeocoderStatus.OK){
					data.push(result[0].address_components[0].long_name);
					data.push(result[0].geometry.location.lat());
					data.push(result[0].geometry.location.lng());
					defer.resolve(data);
				}else{
					defer.resolve(false);
				}
				//TODO : Handel error if google cannot find the address
			});
			return defer.promise;
		};

		this.computeCenter = function(dcLatLng){
			var defer = $q.defer();
			var bound = new google.maps.LatLngBounds();
			for (var i = 0; i < dcLatLng.length; i++) {
				bound.extend( new google.maps.LatLng(dcLatLng[i][4], dcLatLng[i][5]) );
			}
			defer.resolve(bound.getCenter());
			return defer.promise;
		};

		this.getDCDetails = function(dataCenter){
			var defer = $q.defer();
			
			var data = ajaxService.call(dataCenter[1]+'STATUS', 'GET', null);
			data.then(function(response){
				var dcStatus = response.data;
				var resourceStatus = 'No resources being shared';
				if(true === dcStatus.ResourcesShared){
					resourceStatus = 'Resources are shared';
				}
				var computedData = {
					"cpu" : {
						"total" : dcStatus.CPU,
						"consumed" : (dcStatus.CPU === 0) ? dcStatus.CPU : ((dcStatus.UCPU / dcStatus.CPU) * 100).toFixed(2)
					},
					"memory" :{
						"total" : dcStatus.MEM,
						"consumed" : (dcStatus.MEM === 0) ? dcStatus.MEM : ((dcStatus.UMEM / dcStatus.MEM) * 100).toFixed(2)
					},
					"disk" :{
						"total" : dcStatus.DISK,
						"consumed" : (dcStatus.DISK === 0) ? dcStatus.DISK : ((dcStatus.UDISK / dcStatus.DISK) * 100).toFixed(2)
					},
					"resourceStatus" :{
						"outOfResources" : resourceStatus
					}
				};
				defer.resolve(computedData);
			},function(error){
				defer.reject(error);
			});
			return defer.promise;
		};

		this.getDCHealth = function(marker){
			var endPoint = marker.endPoint;
			
			var defer = $q.defer();
			var data = [marker];
			var dcHealth = ajaxService.call(endPoint+'STATUS', 'GET', null);
			dcHealth.then(function(response){
				data.push(response.data);
				defer.resolve(data);
			}, function(error){
				error.marker = marker;
				defer.resolve(error);
			});
			return defer.promise;
		};

	}]);