rico.controller('composeCtrl', function ($scope, $state, $ionicHistory, $stateParams, $ionicLoading, toaster, messageservice) {
  $scope.Text = {};

  messageservice.controllerid(localStorage.DepotID, function (data, status) {
    debugger;
    $scope.controllerlist = data.Data;
    // console.log(localStorage);

  },

     function (errData, errStatus) {

     });



  $scope.hasError = false;
  $scope.send = function (items, composeFrom) {

    if (composeFrom.$invalid) {
      composeFrom.$setPristine();
      $scope.hasError = true;
      return false;
    }
    debugger;
    var sub = items.substring(0, 20);
    var dd = JSON.parse(localStorage.driver);
    debugger;
    for (var i in $scope.controllerlist) {

      var ToUsers = [$scope.controllerlist[i].EmailID];
      // console.log(ToUsers);
      debugger;

    }
    console.log(ToUsers);
    if (ToUsers == 'undefined' || ToUsers == '' || ToUsers == null) {
      toaster.pop('warning', "Controller Not Found");
      return false;
    }
    var message = {
      "ToUser": ToUsers,   // ToUser Mail Id
      "FromUserId": dd.DriverID,               // Driver Id  
      "ParentMessageId": "0",
      "Subject": sub,
      "MessageText": items,
      "Status": false,
      "AllControllers": false,
      "AllDrivers": false
    }

    messageservice.postsend(message, function (data, status) {
      toaster.pop('success', "Message Sent.");
      $scope.Text.sendmsg = "";
      $ionicHistory.nextViewOptions({
        disableAnimate: true,
        disableBack: true,
        historyRoot: true
      });
      $state.go("app.docketlist");

    },
       function (errData, errStatus) {
         //toaster.pop('error', "Network Error!", "Check your Network Connection!");
       });
  }


});
