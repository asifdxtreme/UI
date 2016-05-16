'use strict';
angular.module('hcf')
	.constant('api', {
		'endPoint' :{
			'url' : 'http://54.171.57.70:8080/v1'
		},
		'dcBootstrap' : {
			'url' : '/BOOTSTRAP',
			'method' : 'GET'
		},
		'latency' :{
			'url' : '/LATENCY',
			'method' : 'GET'
		},
		'status' :{
			'url' : '/STATUS',
			'method' : 'GET'
		}
	});