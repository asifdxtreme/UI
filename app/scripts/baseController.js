'use strict';
angular.module('hcf.base')
	.controller('baseController', ['$rootScope', '$scope', '$state',
		function($rootScope, $scope, $state){
			console.log('Base Controller');
			if($state.current.name === 'base'){
				$state.go('base.map');
			}
	}]);