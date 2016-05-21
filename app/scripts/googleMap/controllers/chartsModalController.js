'use strict';
angular.module('hcf.googleMap')
	.controller('chartsModalController', ['$scope', '$mdDialog', '$q', '$log', 'mapServices', 'ajaxService',
		function($scope, $mdDialog, $q, $log, mapServices, ajaxService){

		//Define the base configuration for Highcharts
		$scope.xAxis = [];
		$scope.cpuData = [];
		$scope.memoryData = [];
		$scope.diskData = [];
		$scope.cpuDataUsed = [];
		$scope.memoryDataUsed = [];
		$scope.diskDataUsed = [];
		$scope.seriesData = [
			{
	            name: 'CPU',
	            type: 'column',
	            data: $scope.cpuData,
	            tooltip: {
	                valueSuffix: ' Cores'
	            },
	            color: '#106E9C'
	        },
	        {
	            name: 'CPU Used',
	            type: 'column',
	            data: $scope.cpuDataUsed,
	            tooltip: {
	                valueSuffix: ' Cores'
	            },
	            color: '#F50303'
	        },
	        {
	            name: 'Memory',
	            type: 'column',
	            yAxis: 1,
	            data: $scope.memoryData,
	            tooltip: {
	                valueSuffix: ' MB'
	            },
	            color: '#C3C714'
	        },
	        {
	            name: 'Memory Used',
	            type: 'column',
	            yAxis: 1,
	            data: $scope.memoryDataUsed,
	            tooltip: {
	                valueSuffix: ' MB'
	            },
	            color: '#F50303'
	        },
	        {
	            name: 'Disk',
	            type: 'column',
	            yAxis: 1,
	            data: $scope.diskData,
	            tooltip: {
	                valueSuffix: ' MB'
	            },
	            color: '#14C765'
	        },
	        {
	            name: 'Disk Used',
	            type: 'column',
	            yAxis: 1,
	            data: $scope.diskDataUsed,
	            tooltip: {
	                valueSuffix: ' MB'
	            },
	            color: '#F50303'
	        }
		];
		$scope.chartConfig = {
			options: {
				chart: {
					type: 'column'
				},
				tooltip: {
					style: {
						padding: 10,
						fontWeight: 'bold'
					}
				},
				plotOptions: {
		            column: {
		                
		                dataLabels: {
		                    enabled: true,
		                    color: (Highcharts.theme && Highcharts.theme.dataLabelsColor) || 'black',
		                    style: {
		                        textShadow: '0 0 1px grey'
		                    }
		                }
		            }
		        }
			},
			title: {
				text: 'DC Resource Utilization'
			},
			subtitle: {
				text: 'CPU - Memory - Disk'
			},
			xAxis: {
	            categories: $scope.xAxis,
	            crosshair: true
	        },
	        yAxis: [
		        {
		            title: {
		                text: 'CPU Cores',
		            },
		            gridLineWidth: 0,
		            opposite: true,
		            min: 0,
		            labels: {
		                format: '{value}',
		                style: {
		                    color: Highcharts.getOptions().colors[0]
		                }
		            }
		        },
		        {
		            title: {
		                text: 'Disk & Memory',
		            },
		            min: 0,
		            labels: {
		                format: '{value} MB',
		                style: {
		                    color: Highcharts.getOptions().colors[1]
		                }
		            }
		        }
	        ],
	        series: $scope.seriesData,
			useHighStocks: false
		};
		console.log($scope.seriesData);
		function getDCStatus(endPoint){
			var defer = $q.defer();
			var status = ajaxService.call(endPoint+'STATUS', 'GET', null);
			status.then(function(response){
				defer.resolve(response.data);
			},function(error){
				defer.resolve(error);
			});
			return defer.promise;
		}

		var dcStatusPromises = [];
		mapServices.getDCList().then(function(response){
			var dcList = response.data;
			var i = 0, len = dcList.length;
			for(i = 0; i < len; i++){
				dcStatusPromises.push(getDCStatus(dcList[i].EndPoint));
			}

			$q.all(dcStatusPromises).then(function(response){
				for (var i = 0; i < response.length; i++) {
					if(!response[i].config){
						$scope.xAxis.push(response[i].Name);
						$scope.cpuData.push(response[i].CPU);
						$scope.memoryData.push(response[i].MEM);
						$scope.diskData.push(response[i].DISK);
						$scope.cpuDataUsed.push(response[i].UCPU);
						$scope.memoryDataUsed.push(response[i].UMEM);
						$scope.diskDataUsed.push(response[i].UDISK);
					}
				}
			});
		},function(error){
			$log.debug(error);
		});

        $scope.hide = function() {
            $mdDialog.hide();
        };
        
        $scope.cancel = function() {
            $mdDialog.cancel();
        };
        
        $scope.answer = function(answer) {
            $mdDialog.hide(answer);
        };
	}]);