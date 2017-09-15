'use strict';
angular.module('serviceCenter')
	.constant('apiConstant', {
		endPoint :{
			url : 'http://127.0.0.1',
			port: '30100'
		},
		api : {
			microservice: {
				url: 'registry/v3/microservices',
				method: 'GET'
			},
			instances: {
				url: 'registry/v3/microservices/{{serviceId}}/instances?tags=',
				method: 'GET'
			},
			consumer: {
				url: 'registry/v3/microservices/{{consumerId}}/providers',
				method: 'GET'
			},
			provider: {
				url: 'registry/v3/microservices/{{proviserId}}/consumers',
				method: 'GET'
			}
		}
	});
	