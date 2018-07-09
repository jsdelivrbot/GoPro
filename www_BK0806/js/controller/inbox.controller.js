rico.controller('inboxCtrl', function ($scope, $stateParams, $rootScope, $ionicLoading, $filter, toaster, messageservice) {

    $scope.InitInbox = function () {

        $ionicLoading.show({
            content: 'Loading',
            animation: 'fade-in',
            showBackdrop: true,
            maxWidth: 200,
            showDelay: 0
        });

        messageservice.inboxmsg(JSON.parse(localStorage.driver).DriverID, function (data, status) {
            try {

                $ionicLoading.hide();
                $scope.$broadcast('scroll.refreshComplete');

                $scope.msgdata = [];
                $scope.inboxmsgData = data.Data;

                for (var i in $scope.inboxmsgData) {
                    $scope.msgdata[i] = ({ UserID: $scope.inboxmsgData[i].UserID, message: [] })
                    for (var j in $scope.inboxmsgData[i].MessageInfo) {

                        $scope.msgdata[i].FromUser = $scope.inboxmsgData[i].MessageInfo[j].FromUser;

                        if (!$scope.inboxmsgData[i].MessageInfo[j].IsRead) {

                            $scope.msgdata[i].message.push($scope.inboxmsgData[i].MessageInfo[j]);


                        }

                    }
                    $scope.msgdata[i].message = $filter('orderBy')($scope.msgdata[i].message, '-CreatedDate');

                }
                debugger;

                //console.log($scope.inboxmsgData[0].MessageInfo[0].FromUser);
                //angular.forEach($scope.inboxmsgData, function ( data) {

                //    if (data.UserID != null) {
                //        angular.forEach(data.MessageInfo, function (msgval) {

                //            $scope.msgdata.push(msgval);



                //        })
                //    }


                //});
                //console.log($scope.msgdata);


                //$scope.clickFunction = function () {
                //    $scope.$broadcast('message_from_inbox_controller', $scope.msgdata);
                //    console.log($scope.msgdata);
                //};

            } catch (e) {

            }


        }, function (errData, errStatus) {
            //toaster.pop('error', "Network Error!", "Check your Network Connection!");
            $ionicLoading.hide();
            $scope.$broadcast('scroll.refreshComplete');
        });
    }
    $scope.InitInbox();
    $rootScope.$on('inboxReceived', function (event, data) {
        $scope.InitInbox();
    });
    $scope.msgdetail = function (selectmsg) {
      debugger;
      if (selectmsg.message[0]) {
        localStorage.messageid = selectmsg.message[0].MessageId;
      }
      
      
    }
});