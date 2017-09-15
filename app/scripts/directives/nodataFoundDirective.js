'use strict';
angular.module('serviceCenter')
	.directive('fetchingNoData', ['$state', function($state){
		return {
			scope :{
				'contentStatus' : '=data',
				'apiInfo' : '=info'
			},
			restrict : 'E',
			templateUrl : 'scripts/views/nodataFoundDirective.html',
			link : function(scope){
				scope.reload = function(){
					$state.go('.', {}, {reload: true});
				};
			}
		};
	}]);