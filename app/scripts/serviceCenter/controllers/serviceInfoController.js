'use strict';
angular.module('serviceCenter')
	.controller('serviceInfoController', ['$scope', 'httpService', 'commonService', '$q', 'apiConstant','$stateParams',
		function($scope, httpService, commonService, $q, apiConstant, $stateParams){

			$scope.name ="service Info page";
}]);