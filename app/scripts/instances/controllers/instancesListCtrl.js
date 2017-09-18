'use strict';
angular.module('serviceCenter')
	.controller('instancesListController',['$q','$scope', 'httpService', 'apiConstant','servicesList','commonService',
			 function($q,$scope, httpService, apiConstant,servicesList,commonService){

		$scope.servicesList = servicesList;
		$scope.appList = 'fetching';
		$scope.instanceList = "Instance List";
		$scope.tableHeaders = [
				{
					'key': 'Name'
				},
				{
					'key': 'Status'
				},
				{
					'key': 'CreatedAt'
				},
				{
					'key': 'Address'
				}
			];
		var promises;
		$scope.getAllInstances = function(){
			promises = [];
			for (var i = 0; i < $scope.servicesList.length; i++) {
				var api = apiConstant.api.instances.url;
				var url = api.replace("{{serviceId}}", $scope.servicesList[i].serviceId);
				var method = apiConstant.api.instances.method;
				var headers = {"X-ConsumerId": $scope.servicesList[i].serviceId};

				promises.push(httpService.apiRequest(url,method,null,headers));
				angular.element(document.querySelector('.fa-refresh')).removeClass('fa-spin');
			}
		};
		$scope.getAllInstances();

		$scope.refreshAppList = function() {
				angular.element(document.querySelector('.fa-refresh')).addClass('fa-spin');
				$scope.getAllInstances();
		};

		$q.all(promises).then(function(response){
			$scope.instancesList = [];
			if(response && response.length > 0) {
				for (var i = 0; i < response.length; i++) {
					if(response[i] && response[i].data && response[i].data.instances) {
						response[i].data.instances.forEach(function(instances){
							var instance = {
								instanceName : instances.hostName.charAt(0).toUpperCase()+instances.hostName.slice(1),
								status: instances.status.toLowerCase(),
								createdAt: commonService.timeFormat(instances.timestamp),
								address: instances.endpoints[0]
							};
							$scope.instancesList.push(instance);
						})
					}
					if(response.length == i+1) {
						if($scope.instancesList.length > 0){
							$scope.appList = '';
						}else {
							$scope.appList = 'empty';
						}
						angular.element(document.querySelector('.fa-refresh')).removeClass('fa-spin');
					}
				}
			}
			else {
			   $scope.appList = 'empty';
			   angular.element(document.querySelector('.fa-refresh')).removeClass('fa-spin');
			}
			
		},function(error){
			$scope.appList = 'failed';
			angular.element(document.querySelector('.fa-refresh')).removeClass('fa-spin');
		});

	}]);
