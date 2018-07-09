'use strict';

rico.factory('docketlistservice', function ($rootScope, $http) {

    var service = {

        docketlist: function (data, success, failure) {
            // console.log(data);
            $http.post(baserURL() + "Docket/GetDocketDetailsByDriverID" ,data).success(success).error(failure);
        },
        acceptall: function (data, success, failure) {
            $http.post(baserURL() + "Docket/AcceptAll", data).success(success).error(failure);

        }
    }

    return service;
});
