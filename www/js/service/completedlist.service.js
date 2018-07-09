'use strict';

rico.factory('completedlistservice', function ($rootScope, $http) {

    var service = {

        completedlist: function (data, success, failure) {
            $http.post(baserURL() + "Docket/GetCompletedDockesByDriverID" , data).success(success).error(failure);
        }
    }

    return service;
});