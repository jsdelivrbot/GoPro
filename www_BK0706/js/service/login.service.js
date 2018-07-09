'use strict';

rico.factory('loginservice', function ($rootScope, $http) {

    var service = {

        login: function (data, success, failure) {
           // console.log(data);
            $http.post(baserURL() + "Login/MobileLogin", data).success(success).error(failure);
            
        },

        loggedout: function (data, success, failure) {
        	// console.log(data);
           
            $http.post(baserURL() + "Login/MobileLogout", data).success(success).error(failure);
            
        }
    }

    return service;
});