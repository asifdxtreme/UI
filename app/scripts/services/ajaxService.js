'use strict';
angular.module('hcf')
	.factory('ajaxService', ['$http', '$q', function($http, $q){

		function call(url, method, payload){
			var defer = $q.defer();
			$http({
				url : url,
				method : method,
				data : payload
			}).then(function(response){
				defer.resolve(response);
			}, function(error){
				defer.reject(error);
			});

			return defer.promise;
		}

		return {
			call : call
		};
	}]);