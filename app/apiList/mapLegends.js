'use strict';
angular.module('hcf')
	.constant('mapLegends', {
		'legends' : [
			{
				'icon' : '<div class="circle"></div>',
				'description' : 'Represents a Data Center, you can click to view the status of the DC'
			},
			{
				'icon' : '<div class="circle circle-green"></div>',
				'description' : 'Represents a Healthy Data Center'
			},
			{
				'icon' : '<div class="circle circle-red"></div>',
				'description' : 'Represents that a Data Center is down or has not more resources'
			},
			{
				'icon' : '<div class="arrowhead"></div>',
				'description' : 'Represents the direction of the connection between Data Centes'
			},
			{
				'icon' : '<div class="badge">xxx.xx µs</div>',
				'description' : 'Represents the latency of data communication between Data Centes'
			}
		]
	});