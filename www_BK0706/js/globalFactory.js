'use strict';

rico.factory('globalfactory', function ($rootScope, $http) {

    //var indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;

    //var db;
    //var request = indexedDB.open("newDatabase", 2);

    //request.onupgradeneeded = function (event) {
        
    //    var db = event.target.result;
    //    var objectStore = db.createObjectStore("docketList", { keyPath: "DocketID" });

    //}

    //request.onerror = function (event) {
        
    //    console.log("error: ");
    //};



    //request.onsuccess = function (event) {
        
    //    db = request.result;
    //    console.log("success: " + db);
    //};




    var service = {

        initIndexDb: function () {



            var indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB || window.shimIndexedDB;



            var db;

            var request = indexedDB.open("newDatabase", 2);



            request.onupgradeneeded = function (event) {



                var db = event.target.result;

                var objectStore = db.createObjectStore("docketList", { keyPath: "DocketID" });



            }



            request.onerror = function (event) {



                console.log("error: ");

            };







            request.onsuccess = function (event) {



                db = request.result;

                console.log("success: " + db);

            };



        },
        submitDel: function (data, success, failure) {

            $http.post(baserURL() + "Login", data).success(success).error(failure);
        },

        insertData: function (data) {
            
            var request;
            for (var i in data) {

                request = db.transaction(["docketList"], "readwrite").objectStore("docketList").add(data[i]);

            }

            request.onsuccess = function (event) {
                
                //alert("Kenny has been added to your database.");
            };

            request.onerror = function (event) {
                
                //alert("Unable to add data\r\nKenny is aready exist in your database! ");
            }

        }

    }

    return service;
});
