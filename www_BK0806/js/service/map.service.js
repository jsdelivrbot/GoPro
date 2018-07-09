'use strict';

rico.factory('mapservice', function ($rootScope, $http) {

    var service = {

        postBackgroundLocation: function (data, success, failure) {

            $http.post(baserURL() + "Docket/SaveDriverLocation", data).success(success).error(failure);


        }
    }

    return service;
});
