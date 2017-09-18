'use strict';
angular.module('serviceCenter')
	.controller('serviceInfoController', ['$scope', 'httpService', 'commonService', '$q', 'apiConstant', '$state', '$stateParams','currentService',
		function($scope, httpService, commonService, $q, apiConstant, $state, $stateParams, currentService){

			var serviceId = $stateParams.serviceId;
			$scope.currentServiceDetail = currentService;

			var apis = [];
			var instanceUrl = apiConstant.api.instances.url;
			var instanceApi = instanceUrl.replace('{{serviceId}}', serviceId);
			apis.push(instanceApi);
			var consumerUrl = apiConstant.api.consumer.url;
			var consumerApi = consumerUrl.replace('{{consumerId}}', serviceId);
			apis.push(consumerApi);
			var providerUrl = apiConstant.api.provider.url;
			var providerApi = providerUrl.replace('{{proviserId}}', serviceId);
			apis.push(providerApi);

			var promises =[];
			for (var i = 0; i < apis.length; i++) {
				var url = apis[i];
				var method = "GET";
				var headers = {"X-ConsumerId": serviceId};
				promises.push(httpService.apiRequest(url,method,null,headers));
			}

			$q.all(promises).then(function(response){
				$scope.instances = response[0].data.instances;
				$scope.providers = response[1].data.providers;
				$scope.consumers = response[2].data.consumers;
			},function(error){
				$scope.instances = [];
				$scope.providers = [];
				$scope.consumers = [];
			});

			$scope.showInstance = function(){
				$state.go('sc.info.instance')
			};

			$scope.showProvider = function(){
				$state.go('sc.info.provider')
			};

			$scope.showConsumer = function(){
				$state.go('sc.info.consumer')
			};

			$scope.convertTime = function(timestamp){
				return commonService.timeFormat(timestamp);
			};
			
}]);