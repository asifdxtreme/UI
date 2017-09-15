'use strict';
angular.module('serviceCenter')
		.service('commonService', [function(){

			var timeFormat = function(timestamp) {
				var date = new Date(timestamp * 1000);
				var month = date.getMonth()+1;
				var formatedDate = date.getFullYear()+ '-' + month + '-' + date.getDate() + ' ' +date.getHours()+ ':'+ date.getMinutes();
				return formatedDate;
			};

			return {
				timeFormat: timeFormat
			};

}]);