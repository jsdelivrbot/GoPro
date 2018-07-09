'use strict';

rico.factory('poddetailsservice', function ($rootScope, $http) {

    var service = {

      getPoddetails: function (data, success, failure) {
        debugger;
        var input = { driverID: JSON.parse(localStorage.driver).DriverID, X3DriverCode: JSON.parse(localStorage.driver).AccountCode, X3DocketID:data };
        $http.post(baserURL() + "Docket/GetPODDetails", input).success(success).error(failure);
        }
    }

    return service;
});
