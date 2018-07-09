'use strict';

rico.factory('docketdetailservice', function ($rootScope, $http) {
debugger;
    var service = {

        docketdetail: function (data, success, failure) {
            $http.post(baserURL() + "Docket/GetDocketDetailsByDocketID", data).success(success).error(failure);
        },
        postdocketstatus: function (data, success, failure) {
        		$http.post(baserURL() + "Docket/UpdateStatus", data).success(success).error(failure);
        }
    }

    return service;
});
