rico.controller('podCtrl', function ($scope, $state, $stateParams, $ionicLoading, $timeout, $ionicHistory, $ionicViewService, $rootScope, $location, toaster, docketdetailservice, poddetailsservice) {


    
    // poddetailsservice.getPoddetails($stateParams.DocketID, function (data, status) {
    //     debugger;
    //     $scope.poddetails = data.Data;
    //     console.log($scope.poddetails);
    //     $scope.ctrn = $scope.poddetails[0];
    //     localStorage.ctrn = $scope.ctrn.CTRN
    // }, function (data, status) {
    //     //toaster.pop('error', "Network Error!", "Check your Network Connection!");
    //     $ionicLoading.hide();

    // })
    // console.log($scope.poddetails);
    // console.log(localStorage.ctrn);
    $scope.podData = {
        expectedPackage: JSON.parse($stateParams.PackageExpected),
        dockerID: $stateParams.DocketID,
        TrackingID: localStorage.ctrn,
    };

    $scope.waitandreturn = JSON.parse($stateParams.WaitAndReturn),
    $scope.imgError = false;
    $scope.commentReq = false;

    $scope.errlog = false;

    $scope.checkText = function (textForm) {

    }

    $scope.showDetails = function (podForm, podData) {

        if (podForm.$invalid) {
            podForm.$setPristine();
            $scope.errlog = true;
            return false;
        }

        //var sigImg = signaturePad.toDataURL();
        //$scope.podData.signature = sigImg;

        var sigImg = $scope.accept();
        console.log(sigImg.isEmpty);


        var sign = sigImg.isEmpty;

        if (sign == true) {
            $scope.imgError = true;
            return false;
        } else {
            //    var sigImg = signaturePad.toDataURL();
            //var sigImg = $scope.accept();
            $scope.podData.signature = sigImg;
            $scope.imgError = false;
        }

        $ionicLoading.show({
            content: 'Loading',
            animation: 'fade-in',
            showBackdrop: true,
            maxWidth: 200,
            showDelay: 0
        });

        var delItem = {
            "DocketId": $stateParams.DocketID,
            "AddressId": $stateParams.AddressID,
            "Signature": $scope.accept().dataUrl.split(',')[1],
            "Name": $scope.podData.getname,
            "NoOfPackagesDelivered": $scope.podData.getpackage,
            "Comments": $scope.podData.getcomments ? $scope.podData.getcomments : "",
            "Status": $stateParams.Status,
            "IsCOD": $rootScope.preState == "app.survey" ? true : false,
            "IsDriverPOD": false,
            "IsCustomerPOD": true,
            "IsManagerPOD": false,
            "CashReceived": "",
            "DriverSignature": "",
            "CashReturned": "",
            "PODName": "",
            "ManagerSignature": "",
            "DiscrepComments": "",
            "CustomerAccountCode": $stateParams.cutomerID,
            "DriverId": localStorage.accode,
            "Depotcode": localStorage.deptcode
        }
        docketdetailservice.postdocketstatus(delItem, function (data, status) {
            $ionicLoading.hide();
            $ionicViewService.getBackView();
            $ionicViewService.clearHistory();
            $ionicViewService.getBackView();
            podForm.$setPristine();
            $scope.podData = {};
            $ionicHistory.nextViewOptions({
                disableAnimate: true,
                disableBack: true,
                historyRoot: true
            });
            $state.go("app.docketlist");

        }, function (errData, errStatus) {
            //toaster.pop('error', "Network Error!", "Check your Network Connection!");
            //podForm.$setPristine();
            //$scope.podData = {};
            $ionicLoading.hide();

        });
    }

    $scope.clearSign = function () {

        $scope.clear();

    }

});