'use strict';

rico.factory('loginservice', function ($rootScope, $http) {

    var service = {

        login: function (data, success, failure) {
           
            $http.post(baserURL() + "Login/MobileLogin", data).success(success).error(failure);
            
        }
    }

    return service;
});
