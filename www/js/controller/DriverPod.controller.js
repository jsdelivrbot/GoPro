rico.controller('driverPodCtrl', function ($scope, $stateParams, $state, $ionicLoading, toaster, docketdetailservice) {
    
    $scope.cash = {
        cashexp: JSON.parse($stateParams.CashExpected)
    };
    $scope.imgError = false;
    $scope.hasError = false;

    $ionicLoading.show({
        content: 'Loading',
        animation: 'fade-in',
        showBackdrop: true,
        maxWidth: 200,
        showDelay: 0
    });
    docketdetailservice.docketdetail($stateParams.DocketID, function (data, status) {
        $ionicLoading.hide();
        $scope.docketDetailList = data.Data;

    }, function (errData, errStatus) {
        //toaster.pop('error', "Network Error!", "Check your Network Connection!");
        $ionicLoading.hide();
    });

    $scope.showData = function (dpodForm, cash) {

        if (dpodForm.$invalid) {
            dpodForm.$setPristine();
            $scope.hasError = true;
            return false;
        }

        //if ($scope.cash.cashrec != $scope.cash.cashexp) {
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
            "Comments": $scope.cash.comments ? $scope.cash.comments : "",
            "Status": $stateParams.Status,
            "IsCOD": true,
            "IsDriverPOD": true,
            "IsCustomerPOD": false,
            "IsManagerPOD": false,
            "CashReceived": $scope.cash.cashrec,
            "DriverSignature": $scope.accept().dataUrl.split(',')[1],
            "CashReturned": $scope.cash.cashexp,
            "PODName": "",
            "ManagerSignature": "",
            "DiscrepComments": "",
            "DriverId": localStorage.accode,
            "Depotcode": localStorage.deptcode
        }
        
        docketdetailservice.postdocketstatus(delItem, function (data, status) {
            
            $ionicLoading.hide();
            $scope.docketDetailList = data.Data;
            $state.go("app.survey", { DocketID: $stateParams.DocketID, AddressID: $stateParams.AddressID, Status: $stateParams.Status, PackageExpected: $stateParams.PackageExpected });

        }, function (errData, errStatus) {
            //toaster.pop('error', "Network Error!", "Check your Network Connection!");
            $ionicLoading.hide();

        });

    };

    $scope.clearSign = function () {

        $scope.clear();

    }

});