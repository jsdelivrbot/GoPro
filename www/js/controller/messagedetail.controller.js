rico.controller('messagedetailCtrl', function ($scope, $rootScope, $state, $ionicHistory, $stateParams, $ionicLoading, toaster, messageservice, takebreakservice) {
  debugger;
  $scope.Text = {};
  $stateParams;
  //$scope.inbmsg = [];
  //$scope.$on("message_from_inbox_controller", function (event, message) {
  //    $scope.inbmsg = message;
  //    
  //    Console.log(inbmsg);
  //});


  //$scope.InitInbox = function () {


  //$ionicLoading.show({
  //    content: 'Loading',
  //    animation: 'fade-in',
  //    showBackdrop: true,
  //    maxWidth: 200,
  //    showDelay: 0
  //});



  messageservice.inboxmsg(JSON.parse(localStorage.driver).DriverID, function (data, status) {
    try {
      debugger;
      $scope.inboxmsgData = data.Data;

      for (var i in $scope.inboxmsgData) {

        if ($scope.inboxmsgData[i].UserID == $stateParams.UserID) {
          $scope.msglist = $scope.inboxmsgData[i].MessageInfo;
        }
      }

      //messageservice.updateMessageIsRead(JSON.parse($stateParams.UserID), function (data, status) {

      //}, function (errData, errStatus) {

      //});

      var msg = JSON.parse(localStorage.messageid);
      messageservice.Showmobilemessage(msg, function (data, status) {
        //  debugger;
        takebreakservice.unreadMessage(JSON.parse(localStorage.driver).DriverID, function (data, status) {
          debugger;
          $rootScope.$broadcast('myEvent', data);

        }, function (errData, errStatus) {
          //debugger;


        });
      }, function (errData, errStatus) {

      });

    } catch (e) {

    }

  }, function (errData, errStatus) {
    //toaster.pop('error', "Network Error!", "Check your Network Connection!");
    $ionicLoading.hide();
    //$scope.$broadcast('scroll.refreshComplete');
  });

  $scope.send = function (items, composeFrom) {
    debugger;

    if (composeFrom.$invalid) {

      composeFrom.$setPristine();
      $scope.hasError = true;
      return false;
    }

    var sub = items.substring(0, 20);

    var dd = JSON.parse(localStorage.driver);
    for (var i in $scope.msglist) {

      var ToUsers = [$scope.msglist[0].FromUser];

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
      toaster.pop('success', "Sent.");
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
  //}
  //$scope.InitInbox();
});
