rico.controller('mapCtrl', function ($scope, $stateParams, $rootScope, $ionicLoading, $timeout, docketdetailservice) {
    var map,
        marker = [],
        directionsDisplay,
        directionsService,
            bounds;
    $scope.address = '';
    $scope.GetBounds = function (startLoc, stopLoc) {

        bounds = new google.maps.LatLngBounds();

        bounds.extend(startLoc);
        bounds.extend(stopLoc);
        map.fitBounds(bounds);

    }

    $scope.GetDirection = function (startLoc, stopLoc) {

        var request = {
            origin: startLoc,
            destination: stopLoc,
            travelMode: google.maps.TravelMode.DRIVING
        };

        directionsService.route(request, function (response, status) {

            $scope.dist = response.routes[0].legs[0].distance.text;
            $scope.timetotravel = response.routes[0].legs[0].duration.text;
            $scope.addressDetail = response.routes[0].legs[0].end_address;
            $scope.$apply();

            if (status == google.maps.DirectionsStatus.OK) {

                directionsDisplay.setDirections(response);
                directionsDisplay.setMap(map);
                google.maps.event.addListenerOnce(map, 'idle', function () {
                    google.maps.event.trigger(map, 'resize');
                });
            } else {
                alert("Directions Request from " + start.toUrlValue(6) + " to " + end.toUrlValue(6) + " failed: " + status);
            }
        }, function () {


        });

    }

    $scope.getDocketData = function () {
        debugger;
        //var input = { driverID: JSON.parse(localStorage.driver).DriverID, X3DriverCode: JSON.parse(localStorage.driver).AccountCode, X3DocketID: $stateParams.DocketID };
        //docketdetailservice.docketdetail($stateParams.docID, function (data, status) {

        //    $scope.docketDetailList = data.Data;

        var startLoc,
            stopLoc;

        if ($stateParams.addType == 'COL') {
            startLoc = new google.maps.LatLng($stateParams.pickupLat, $stateParams.pickupLong);
            //marker.push(new google.maps.Marker({
            //    position: startLoc,
            //    map: map
            //}));
            //$scope.address = $scope.docketDetailList.Pickup;

            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(function (p) {
                    stopLoc = new google.maps.LatLng(p.coords.latitude, p.coords.longitude);

                    //marker.push(new google.maps.Marker({
                    //    position: stopLoc,
                    //    map: map
                    //}));
                    $timeout(function () {

                        $scope.GetBounds(stopLoc, startLoc);

                        $scope.GetDirection(stopLoc, startLoc);
                    }, 1000);
                }, function (errMsg) {
                    debugger;
                    alert("Couldn't get current location!");
                    navigator.geolocation.getCurrentPosition(function (p) {
                        stopLoc = new google.maps.LatLng(p.coords.latitude, p.coords.longitude);

                        //marker.push(new google.maps.Marker({
                        //    position: stopLoc,
                        //    map: map
                        //}));

                        $timeout(function () {
                            $scope.GetBounds(stopLoc, startLoc);
                            $scope.GetDirection(stopLoc, startLoc);
                        }, 1000);
                    }, function (errMsg) {
                        debugger;
                        alert("Couldn't get current location!");
                    });
                }, { timeout: 10000 });
            }


        } else if ($stateParams.addType == 'DEL') {

            //for (var i in $scope.docketDetailList.Delivery) {

            //if ($scope.docketDetailList.Delivery[i].AddressID == $stateParams.addID) {
            startLoc = new google.maps.LatLng($stateParams.delLat, $stateParams.delLong);
            //$scope.latt1 = $scope.docketDetailList.Delivery[i].Latitude;
            //$scope.longg1 = $scope.docketDetailList.Delivery[i].Longitude;
            //$scope.address = $scope.docketDetailList.Delivery[i];

            //}


            //}
            stopLoc = new google.maps.LatLng($stateParams.pickupLat, $stateParams.pickupLong);

            $scope.GetBounds(stopLoc, startLoc);

            $scope.GetDirection(stopLoc, startLoc);

        }
        //map.panTo(marker[0].getPosition());
        //map.setCenter(new google.maps.LatLng(latitude, longitude));

        //}, function (errData, errStatus) {

        //});
    }

    var marker = null;

    $scope.autoUpdate = function () {
        navigator.geolocation.watchPosition(function (position) {
            var newPoint = new google.maps.LatLng(position.coords.latitude,
                                                  position.coords.longitude);

            if (marker) {
                // Marker already created - Move it
                marker.setPosition(newPoint);
            }
            else {
                // Marker does not exist - Create it
                marker = new google.maps.Marker({
                    position: newPoint,
                    map: map,
                    icon: 'img/navigatore.png'
                });
            }
            // Center the map on the new position
            map.setCenter(newPoint);
        }, function errorHandler(err) {
            if (err.code == 1) {
                alert("Error: Access is denied!");
            }

            else if (err.code == 2) {
                alert("Error: Position is unavailable!");
            }
        }, { $timeout: 60000 });

        //    // Call the autoUpdate() function every 5 seconds
        //    $timeout(function () {
        //        $scope.autoUpdate();
        //    }, 5000);

    }



    $scope.InitMap = function () {


        directionsDisplay = new google.maps.DirectionsRenderer();
        directionsService = new google.maps.DirectionsService();

        map = new google.maps.Map(document.getElementById('map'), {
            center: { lat: 13.0827, lng: 80.2707 },
            zoom: 8
        });

        //directionsDisplay.setMap(map);

        google.maps.event.addListenerOnce(map, 'idle', function () {
            google.maps.event.trigger(map, 'resize');
        });

        //$scope.autoUpdate();

        $scope.getDocketData();
    }
    $scope.$on('$ionicView.loaded', function (event) {
        $timeout(function () {
            $scope.InitMap();
        }, 100);
    });

    $scope.distance = function (lat1, lon1, lat2, lon2, unit) {

        var R = 6371; // km (change this constant to get miles)
        var dLat = (lat2 - lat1) * Math.PI / 180;
        var dLon = (lon2 - lon1) * Math.PI / 180;
        var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        var d = R * c;
        if (d > 1) {

            return Math.round(d) + " Kms";
        }
        else if (d <= 1) {

            return Math.round(d * 1000) + " Mtrs";
        }
        return d;
    }


});