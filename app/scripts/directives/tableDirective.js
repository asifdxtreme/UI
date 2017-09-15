'use strict';
angular.module('serviceCenter')
    .directive('tableData', ['$mdDialog', function($mdDialog) {
        return {
            restrict: 'E',
            scope: {
                heading: '=heading',
                headers: '=headers',
                data: '=data',
                pagination: '=pagination',
                refresh: '=refresh',
                dialogClose: '=dialogClose',
                buttons: '=buttons',
                enableSearch: '=search',
                enablePagination: '=hasPagination',
                appList:'=appList',
                apiInfo:'=apiInfo'
            },
            templateUrl: 'scripts/views/tableData.html',
            link: function(scope) {
                /*
                	If the table has buttons with functions declared in the controller then the functions must be defined first 
                	and then the buttons configured. Seems like some scope issue need to figure out a better solution
                */
                scope.paginationQuery = {
                    order: 'name',
                    limit: 10,
                    page: 1
                };

                scope.paginationOptions = {
                    rowSelection: false,
                    multiSelect: false,
                    autoSelect: false,
                    decapitate: false,
                    largeEditDialog: false,
                    boundaryLinks: true,
                    limitSelect: true,
                    pageSelect: true
                };

                scope.filter = {
                    options: {
                        debounce: 500
                    },
                };

                scope.showSearch = false;
                scope.searchClose = function() {
                    scope.showSearch = false;
                    scope.filter.search = "";
                };

                scope.searchOpen = function() {
                    scope.showSearch = true;
                };

                scope.reload = function() {
                    scope.refresh();
                };

                scope.close = function() {
                    $mdDialog.cancel();
                };
            }
        };
    }]);
