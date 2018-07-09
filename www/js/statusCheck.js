'use strict';

rico.factory('statusfactory', function ($rootScope, $http, $q, $timeout) {

  var statusDetails = [
    {
      "StatusID": 2,
      "Status": "BKD",
      "StatusDescription": "Booked",
      "colorCode": "#E60000"
    },
     {
       "StatusID": 3,
       "Status": "ALL",
       "StatusDescription": "Allocated",
       "colorCode": "#E60000"
     },
    {
      "StatusID": 4,
      "Status": "ACC",
      "StatusDescription": "Accept",
      "colorCode": "#5E9100"
    },
    {
      "StatusID": 5,
      "Status": "COL",
      "StatusDescription": "Arrived@Col",
      "colorCode": "#BF5C00"
    },
    {
      "StatusID": 6,
      "Status": "POB",
      "StatusDescription": "POB",
      "colorCode": "#FF8700"
    },
    {
      "StatusID": 7,
      "Status": "DEL",
      "StatusDescription": "Arrived@Del",
      "colorCode": "#006B9E"
    },
    {
      "StatusID": 8,
      "Status": "PPOD",
      "StatusDescription": "PPOD",
      "colorCode": "#00AEEF"
    },
    {
      "StatusID": 9,
      "Status": "POD",
      "StatusDescription": "POD",
      "colorCode": "#00AEEF"
    },
    {
      "StatusID": 10,
      "Status": "CANC",
      "StatusDescription": "CANC",
      "colorCode": "#FF77FF"
    },
    {
      "StatusID": 11,
      "Status": "COA",
      "StatusDescription": "COA",
      "colorCode": "#FF77FF"
    },
    {
      "StatusID": 12,
      "Status": "UNALL",
      "StatusDescription": "UnAllocated",
      "colorCode": "#5E9100"
    },
    {
      "StatusID": 13,
      "Status": "COMP",
      "StatusDescription": "Completed",
      "colorCode": "#FF77FF"
    }
  ];


  return statusDetails;
});
