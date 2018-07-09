'use strict';

rico.factory('takebreakservice', function ($rootScope, $http) {

    var service = {


        postbreakstatus: function (data, success, failure) {

            $http.post(baserURL() + "Docket/UpdateBreakStatus", data).success(success).error(failure);

        },

        getContactDetails: function (data, success, failure) {

            $http.get(baserURL() + "Docket/GetControllerContactDetails/" + data).success(success).error(failure);
        },
        unreadMessage: function (data, success, failure) {

          $http.get(baserURL() + "Message/GetMobileUnReadMessageCount/" + data).success(success).error(failure);

        }
        //getContactDetails: function (data, success, failure) {

        //    $http.get(baserURL() + "Messages/GetAllControllers").success(success).error(failure);
        //}
    }

    return service;
});
