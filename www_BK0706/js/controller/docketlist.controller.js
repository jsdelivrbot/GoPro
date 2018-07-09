rico.controller('docketlistCtrl', function ($scope, $rootScope, $state, $stateParams, $ionicLoading, $cordovaMedia, $ionicViewService, $location, $ionicNavBarDelegate, toaster, $ionicPlatform, $rootScope, docketlistservice, globalfactory, takebreakservice) {

  takebreakservice.unreadMessage(JSON.parse(localStorage.driver).DriverID, function (data, status) {
    debugger;
    //$scope.msgcount = data;
    localStorage.msgcountlast = data;
    $rootScope.$broadcast('myEvent', data);
  }, function (errData, errStatus) {
    //debugger;


  });
  $scope.InitDocketList = function (loader) {
    $scope.starttime = new Date();
    // toaster.pop('warning', "Start", "DocketList!" + new Date());
    if (loader) {
      $ionicLoading.show({
        content: 'Loading',
        animation: 'fade-in',
        showBackdrop: true,
        maxWidth: 200,
        showDelay: 0
      });
    }
    var input = { driverID: JSON.parse(localStorage.driver).DriverID, X3DriverCode: JSON.parse(localStorage.driver).AccountCode }
    //var input = { driverID: "3", X3DriverCode: "DRV0000003" }
    docketlistservice.docketlist(input, function (data, status) {
      debugger
      if (data.ErrorList.HasError) {
        $scope.docketListData = "";
        toaster.pop('warning', "INFO", data.ErrorList.ErrorMessage);
        $ionicLoading.hide();
        $scope.$broadcast('scroll.refreshComplete');
        return false;
      }
      $scope.endtime = new Date();
      // toaster.pop('warning', "END", "DocketList!" + new Date() + " Diffrence = " + (($scope.endtime.getTime() - $scope.starttime.getTime()) / 1000) + " sec");
      $ionicLoading.hide();
      $scope.$broadcast('scroll.refreshComplete');
      $scope.ShowCheck = false;
      $rootScope.$emit('unselectAll', false);
      $scope.docketListData = data.Data;
      debugger;

      if (localStorage.docketLen) {
        console.log($scope.docketListData);
        // console.log(JSON.parse(localStorage.docketLen));
       if ($scope.docketListData.length > JSON.parse(localStorage.docketLen)) {
          // var audio = new Audio('audio/ringtone.mp3');
          // audio.play();
          var src = "/android_asset/www/audio/ringtone.mp3";
          var media = $cordovaMedia.newMedia(src);
          media.play();
          //var audiovs = new Media('cdvfile://localhost/audio/ringtone.mp3');
          //audiovs.play();
          //$cordovaMedia.play(audio);

        }

      }

      localStorage.docketLen = $scope.docketListData.length;
      
      debugger;
      //globalfactory.insertData($scope.docketListData);
      
       var revETA = 0
       var irevETA = 0
        for (var i in $scope.docketListData){
          if ($scope.docketListData[i].IsRevETA == true){
            revETA = revETA + 1
          }
          irevETA += JSON.parse($scope.docketListData[i].RevETAATT);
        }

        
        console.log(irevETA);
        
        if (localStorage.revETA) {
          if (revETA > localStorage.revETA || irevETA > localStorage.irevETA){
            // var audio = new Audio('audio/Alert.mp3');
            //     audio.play();
            var src = "/android_asset/www/audio/Alert.mp3";
            var media = $cordovaMedia.newMedia(src);
                media.play();
          }

        }
        // console.log(revETA);
        // console.log(localStorage.revETA);
        localStorage.revETA = revETA;
        localStorage.irevETA = irevETA;
        console.log(localStorage.irevETA);

    }, function (errData, errStatus) {

      //toaster.pop('error', "Network Error!", "Check your Network Connection!");
      $ionicLoading.hide();
      $scope.$broadcast('scroll.refreshComplete');
      $scope.ShowCheck = false;
      $rootScope.$emit('unselectAll', false);
    });
  }

  $scope.InitDocketList(true);

  $ionicPlatform.on('resume', function () {
    $scope.InitDocketList(false);
  });
  $rootScope.$on('docketReceived', function (event, data) {
    $scope.InitDocketList(false);
  });
  $scope.navDocketDetail = function (docketList) {
    $scope.param = "COMPLETED"
    debugger;
    if (docketList.IsCOD) {

      if (!docketList.IsCustomerSurveyComplete) {
        $scope.param = "SURVEY";
      } else if (!docketList.IsCustomerPODComplete) {
        $scope.param = "PPOD";
      } else if (!docketList.IsManagerPODComplete) {
        $scope.param = "MANAGER";
      }

    }
    debugger;
    $state.go("app.docketdetail", { DocketID: docketList.SageJobId, Button: $scope.param });
  }


  $rootScope.$on('selectAll', function (event, data) {
    debugger;
    $scope.selectflag = false;
    $scope.ShowCheck = data;
    for (var i in $scope.docketListData) {
      //$scope.docketListData[i].selectAll = false;
      if ($scope.docketListData[i].Status == "ALL") {
        $scope.docketListData[i].selectAll = data;
        $scope.selectflag = true;
      }

    }
    debugger;
    if (!$scope.selectflag) {
      $scope.ShowCheck = false;
      $rootScope.$emit('unselectAll', false);
    }
  });
  //var audio = new Audio('audio/sound.mp3');
  //audio.play();
  $rootScope.$on('sendSelectAll', function (event, data) {
    debugger;
    var acceptAllData = "";
    for (var i in $scope.docketListData) {
      if ($scope.docketListData[i].selectAll) {

        if (acceptAllData == "") {
          acceptAllData = $scope.docketListData[i].DocketID.toString();
        } else {
          acceptAllData = acceptAllData + "," + $scope.docketListData[i].DocketID.toString();
        }
      }
    }
    debugger;
    $ionicLoading.show({
      content: 'Loading',
      animation: 'fade-in',
      showBackdrop: true,
      maxWidth: 200,
      showDelay: 0
    });
    console.log(acceptAllData);
    docketlistservice.acceptall(JSON.stringify(acceptAllData), function (data, status) {

      $ionicLoading.hide();
      $scope.ShowCheck = false;
      $rootScope.$emit('unselectAll', false);
      $scope.InitDocketList(true);

    }, function (data, status) {

      $ionicLoading.hide();

      $scope.ShowCheck = false;
      $rootScope.$emit('unselectAll', false);

    });

  });

  $scope.selectDocketCheck = function (data, event) {

    $scope.headerSelectAll = true;
    for (var i in $scope.docketListData) {
      if ($scope.docketListData[i].selectAll) {
        $scope.headerSelectAll = false;
      }
    }
    if ($scope.headerSelectAll) {

      $scope.ShowCheck = false;
      $rootScope.$emit('unselectAll', false);
    }
    event.stopPropagation();
  }

});