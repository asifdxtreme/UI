'use strict';
angular.module('serviceCenter')
	.service('httpService', ['$http', '$q', '$mdDialog','apiConstant',function($http, $q, $mdDialog,apiConstant){

		function apiRequest(requrl, method, payload, headers){
			 var defer = $q.defer();
            if(undefined === requrl || null === requrl || undefined === method || null === method){
                defer.reject("invalid params");
                return defer.promise;
            }
            var baseUrl = apiConstant.endPoint.url + ':' + apiConstant.endPoint.port;
            if(undefined === headers || null === headers){
                headers = {
                    'x-domain-name' : 'default'
                };
            }else{
                headers['x-domain-name'] = 'default';
            }

            var url = baseUrl + '/'+ requrl;
            $http({
                url: url,
                method: method,
                data: payload,
                headers : headers
            }).then(function(response) {
                defer.resolve(response);
            }, function(error) {
                var parentEl = angular.element(document.body);
                $mdDialog.show({
                    parent: parentEl,
                    templateUrl: 'scripts/views/serverError.html',
                    locals: {
                        error: error
                    },
                    skipHide : true,          
                    controller: function($scope, $mdDialog, error) {
                        $scope.error = error;
                        $scope.closeDialog = function() {
                            $mdDialog.hide();
                        };
                    }
                });
                defer.reject(error);
            });
            return defer.promise;
		}

		return {
			apiRequest : apiRequest
		};
	}]);