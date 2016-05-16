/*jshint -W083 */
'use strict';
angular.module('hcf.googleMap')
	.controller('googleMaps', ['$rootScope', '$scope', '$q', '$timeout', '$state', 'mapServices', '$mdSidenav', '$log', '$mdDialog',
        function( $rootScope, $scope, $q, $timeout, $state, mapServices, $mdSidenav, $log, $mdDialog){
		
		var map, mapOptions = {};
        $scope.labelList = [];
        var dcMarkers = [];
                
        function buildToggler(navID) {

            return function() {
                $mdSidenav(navID).toggle().then(function () {
                    $log.debug("toggle " + navID + " is done");
                });
            };
        }

        $scope.showTabDialog = function(ev) {
            $mdDialog.show({
              controller: 'chartsModalController',
              templateUrl: 'scripts/googleMap/views/dcCharts.html',
              parent: angular.element(document.body),
              targetEvent: ev,
              clickOutsideToClose:false,
              fullScreen: true
            }).then(function(answer) {
                $log.debug(answer);
                $log.debug("Resource map closed successfuly");
            }, function() {
                $log.debug("Resource map closed with error");
            });
        };

        $scope.closeMDLeft = function () {
          $mdSidenav('right').close()
            .then(function () {
              $log.debug("close LEFT is done");
            });
        };

        $scope.toggleRight = buildToggler('right');

        $scope.callLatency = true;

        // Discover all the Data Centers
        mapServices.getDCList().then(function(data){
            $scope.dataCenterList = data.data;
            
            //Get the GEO location of all the datacenters based on Country and City names
            mapServices.getGeoLocation($scope.dataCenterList).then(function(data){
                $scope.dcLocations = data;
                
                //Dynamicly get the center for the map for all the GEO locations
                mapServices.computeCenter($scope.dcLocations).then(function(data){
                    $scope.center = data;
                    
                    //Now we have all the dat lets plot the map
                    // map config
                    mapOptions = {
                        center: new google.maps.LatLng($scope.center.lat(), $scope.center.lng()),
                        zoom: 4,
                        mapTypeId: google.maps.MapTypeId.ROADMAP,
                        scrollwheel: true,
                        mapTypeControl: false,
                        zoomControl: false,
                        streetViewControl: false,
                        labels: false
                    };
                    initMap();
                });
            });
        }, function(error){
            if(error){
                $state.go('error');
            }
        });
        
        function getLatency(){
            var delay = 10000;
            if(true === $scope.callLatency){
                delay = 500;
            }
            $timeout(function(){
                $scope.callLatency = false;
                var dcLen = $scope.dcLocations.length, labelLen = $scope.labelList.length;
                var latencyPromise = [];
                for(var i = 0; i < dcLen; i++){
                    latencyPromise.push(mapServices.fetchLatency($scope.dcLocations[i][1], $scope.dcLocations[i][2]));
                }
                $q.all(latencyPromise).then(function(latencyResponse){
                    for(var z = 0; z < latencyResponse.length; z++){
                        if(undefined === latencyResponse[z].config){
                            for(var x = 0; x < latencyResponse[z].length; x++){
                                for(var y = 0; y < labelLen; y++){
                                    if(latencyResponse[z].queriedDc === $scope.labelList[y].dcName && $scope.labelList[y].dcConnectedTo === latencyResponse[z][x].Name){
                                        $scope.labelList[y].setContents((latencyResponse[z][x].Rtt / 1000).toFixed(2) + ' µs');
                                    }
                                }
                            }
                        }else{
                            for(var k = 0; k < labelLen; k++){
                                if(latencyResponse[z].queriedDc === $scope.labelList[k].dcName){
                                    $scope.labelList[k].setContents('&infin;');
                                }
                            }
                        }
                    }
                    getLatency();
                });
                
            }, delay);
        }

        function checkDCHealth(){
            $timeout(function(){
                var dcLen = dcMarkers.length;
                var dcHealthPromises = [];
                
                for(var i = 0; i < dcLen; i++){
                    dcHealthPromises.push(mapServices.getDCHealth(dcMarkers[i]));
                }
                $q.all(dcHealthPromises).then(function(resp){
                    for(var j = 0; j < resp.length; j++){
                        if(!resp[j].config){
                            //Check if this marker hasthe bounce animation if so then remove it 
                            if(resp[j][0].getAnimation() === 1){
                                resp[j][0].setAnimation(null);
                            }
                            // Check if this marker (Data Center) has the IsActiveDc flag set to true, if so then add the bounce aniomation to this marker
                            if(true === resp[j][1].IsActiveDC){
                                resp[j][0].setAnimation(google.maps.Animation.BOUNCE);
                            }
                            //DC policy sets the OOR flag to true if the DC runs out, check this flag to set the DC colour to Orange, 
                            //if false ten set the colour to green
                            if(true === resp[j][1].OutOfResource){
                                resp[j][0].setIcon({
                                    path: google.maps.SymbolPath.CIRCLE,
                                    fillColor: 'orange',
                                    fillOpacity: 0.8,
                                    scale: 6,
                                    strokeColor: 'orange',
                                    strokeWeight: 12
                                });
                            }else if(false === resp[j][1].OutOfResource){
                                resp[j][0].setIcon({
                                    path: google.maps.SymbolPath.CIRCLE,
                                    fillColor: 'green',
                                    fillOpacity: 0.8,
                                    scale: 6,
                                    strokeColor: 'green',
                                    strokeWeight: 12
                                });
                            }
                        }else{
                            //If a DC is down then, the API call will fail resulting into an error 
                            //If you get this error then set the marker colour to red indicating that the DC is not reachable 
                            if(resp[j].config){
                                resp[j].marker.setIcon({
                                    path: google.maps.SymbolPath.CIRCLE,
                                    fillColor: 'red',
                                    fillOpacity: 0.8,
                                    scale: 6,
                                    strokeColor: 'red',
                                    strokeWeight: 12
                                });
                            }
                        }
                    }
                    //After all the compustion is done above call health again this will fire after 5000 milliseconds
                    checkDCHealth();
                });
            }, 5000);
        }

        // init the map
        function initMap() {
            if (map === void 0) {
                map = new google.maps.Map(document.getElementById("gmaps"), mapOptions);
                map.addListener('zoom_changed', function(){
                   var zoom = map.getZoom();
                   if(zoom < 3){
                        map.setZoom(3);
                    }else if(zoom > 8){
                        map.setZoom(8);
                    }
                });
                plotDCOnMap($scope.dcLocations);
            }
        }    
        
        var infowindow = new google.maps.InfoWindow();

        function plotDCOnMap(dataCenterList){
            var marker, i;
            for (i = 0; i < dataCenterList.length; i++) {
                marker = new google.maps.Marker({
                    position: new google.maps.LatLng(dataCenterList[i][4], dataCenterList[i][5]),
                    map: map,
                    icon: {
                        path: google.maps.SymbolPath.CIRCLE,
                        fillColor: 'green',
                        fillOpacity: 0.8,
                        scale: 6,
                        strokeColor: 'green',
                        strokeWeight: 12
                    },
                    draggable: false
                });

                marker.endPoint = dataCenterList[i][1];
                dcMarkers.push(marker);

                var label = new ELabel({
                    latlng: new google.maps.LatLng(dataCenterList[i][4], dataCenterList[i][5]), 
                    type: 'text',
                    label: dataCenterList[i][3], 
                    classname: "label label-primary", 
                    offset: 0, 
                    opacity: 100,
                    overlap: true,
                    clicktarget: false
                });

                label.setMap(map);

                google.maps.event.addListener(marker, 'click', (function(marker, i) {
                    return function() {
                        var dcDetails = mapServices.getDCDetails(dataCenterList[i]);
                        dcDetails.then(function(data){
                            var result = '<ul class="list-group" style="margin-bottom: 0px; margin-top: 0px;">' +
                              '<li class="list-group-item">' +
                                '<span class="badge">' + data.cpu.total + '</span>' +
                                'CPU Consumed ' + data.cpu.consumed + '% of '+
                              '</li>'+
                              '<li class="list-group-item">' +
                                '<span class="badge">' + data.memory.total + '</span>' +
                                'Memory Consumed ' + data.memory.consumed + '% of '+
                              '</li>'+
                              '<li class="list-group-item">' +
                                '<span class="badge">' + data.disk.total + '</span>' +
                                'Disk Consumed ' + data.disk.consumed + '% of '+
                              '</li>'+/*
                              '<li class="list-group-item">' +
                                data.resourceStatus.outOfResources +
                              '</li>'+*/
                            '</ul>';
                            infowindow.setContent(result);
                            infowindow.open(map, marker);
                        }, function(error){
                            if(error.status === -1){
                                infowindow.setContent('<p style="color: red;">Data Center is down</p>');
                            }
                            infowindow.open(map, marker);
                        });
                    };
                })(marker, i));

                var lineSymbol = {
                    path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
                    scale: 4,
                    strokeColor: '#000'
                };
                for(var j = 0; j < dataCenterList.length; j++){
                    if(dataCenterList[i][1] !== dataCenterList[j][1]){
                        new google.maps.Polyline({
                            path: [new google.maps.LatLng(dataCenterList[i][4], dataCenterList[i][5]), new google.maps.LatLng(dataCenterList[j][4], dataCenterList[j][5])],
                            strokeColor: "#5bc0de",
                            strokeOpacity: 0.8,
                            strokeWeight: 2,
                            geodesic: true,
                            icons: [{
                                icon: lineSymbol,
                                offset: '30%'
                            }],
                            map: map
                        });

                        var labelPosition = 'right';
                        if((j % 2) === 0){
                            labelPosition = 'left';
                        }

                        var fromDC = new google.maps.LatLng(dataCenterList[i][4], dataCenterList[i][5]);
                        var toDC = new google.maps.LatLng(dataCenterList[j][4], dataCenterList[j][5]); 
                        var positionAtOffset30 = google.maps.geometry.spherical.interpolate(fromDC, toDC, 0.29);
                        var fromToDCName = dataCenterList[i][0][0] + dataCenterList[i][0][1] + dataCenterList[i][0][2] + ' -> ' + dataCenterList[j][0][0] + dataCenterList[j][0][1] + dataCenterList[j][0][2];
                        
                        var latencyLabel = new ELabel({
                            latlng: new google.maps.LatLng(positionAtOffset30.lat(), positionAtOffset30.lng()), 
                            type: 'value',
                            label: 0,
                            endPoint: dataCenterList[i][1],
                            dcName: dataCenterList[i][2],
                            dcConnectedTo: dataCenterList[j][2],
                            dcLable: fromToDCName,
                            classname: "badge", 
                            position: labelPosition,
                            offset: 0, 
                            opacity: 100,
                            overlap: true,
                            clicktarget: false
                        });
                        $scope.labelList.push(latencyLabel);
                        latencyLabel.setMap(map);
                    }    
                }
                getLatency();
                checkDCHealth();
            }
        }
	}]);