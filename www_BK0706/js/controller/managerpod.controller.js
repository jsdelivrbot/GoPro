rico.controller('ManagerPodCtrl', function ($scope, $ionicLoading, $ionicViewService, $state, $stateParams, $rootScope, $location, $ionicHistory, toaster, docketdetailservice) {

    $scope.pod = {
        cashexpected: JSON.parse($stateParams.CashExpected)
    };
    $scope.imgError = false;
    $scope.errorinfo = false;
    $scope.showdata = function (managerpodform, pod) {
        
        $scope.pod;

        if (managerpodform.$invalid) {
            managerpodform.$setPristine();
            $scope.errorinfo = true;
            return false;
        }

        //if ($scope.pod.cashreceived != $scope.pod.cashexpected) {
        //    $scope.cashErr = true;
        //    $scope.cashRecErr = "*Please enter correct cash";
        //    return false;
        //} else {
        //    $scope.cashErr = false;
        //}

        var sigImg = $scope.accept();
        var sign = sigImg.isEmpty;

        if (sign == true) {
            $scope.imgError = true;
            return false;
        } else {
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
            "Signature": "",
            "Name": "",
            "NoOfPackagesDelivered": "",
            "Comments": $scope.pod.comments ? $scope.pod.comments : "",
            "Status": $stateParams.Status,
            "IsCOD": true,
            "IsDriverPOD": false,
            "IsCustomerPOD": false,
            "IsManagerPOD": true,
            "CashReceived": $scope.pod.cashreceived,
            "DriverSignature": "",
            "CashReturned": $scope.pod.cashreceived,
            "PODName": $scope.pod.podname,
            "ManagerSignature": $scope.accept().dataUrl.split(',')[1],
            "DiscrepComments": "",
            "DriverId": localStorage.accode,
            "Depotcode": localStorage.deptcode
        }
        
        docketdetailservice.postdocketstatus(delItem, function (data, status) {

            $ionicLoading.hide();
            $ionicViewService.getBackView();
            $ionicViewService.clearHistory();
            $ionicViewService.getBackView();
            managerpodform.$setPristine();
            $scope.pod = {};
            $ionicHistory.nextViewOptions({
                disableAnimate: true,
                disableBack: true,
                historyRoot: true
            });
            $state.go("app.docketlist");

        }, function (errData, errStatus) {
            //toaster.pop('error', "Network Error!", "Check your Network Connection!");
            managerpodform.$setPristine();
            $scope.pod = {};
            //signaturePad.clear();
            $ionicLoading.hide();

        });

    }

    $scope.clearSign = function () {

        $scope.clear();

    }

});