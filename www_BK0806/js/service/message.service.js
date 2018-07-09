'use strict';

rico.factory('messageservice', function ($rootScope, $http) {

    var service = {

        inboxmsg: function (data, success, failure) {
            $http.get(baserURL() + "Message/GetAllInboxMessageByUserID/" + data).success(success).error(failure);

        },

        deleted: function (data, success, failure) {

            $http.get(baserURL() + "Message/GetAllDeletedMessageByUserID/" + data).success(success).error(failure);

        },

        sent: function (data, success, failure) {

            $http.get(baserURL() + "Message/GetAllSentMessageByUserID/" + data).success(success).error(failure);

        },

        postsend: function (data, success, failure) {

            $http.post(baserURL() + "Message/SendMessage", data).success(success).error(failure);
        },

        controllerid: function (data, success, failure) {

            $http.get(baserURL() + "Message/GetControllersByDepot/" + data).success(success).error(failure); // Controller Id static So please change it.
        },
        updateMessageIsRead: function (data, success, failure) {

            $http.post(baserURL() + "Message/UpdateMessageIsReadByUserID/" + data).success(success).error(failure);

        },
        Showmobilemessage: function (data, success, failure) {

          $http.post(baserURL() + "Message/Showmobilemessage/" + data).success(success).error(failure);

        }



    }

    return service;
});
