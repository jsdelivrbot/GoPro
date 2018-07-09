rico.controller('docketdetailCtrl', function ($scope, $window, $rootScope, $state, $stateParams, $ionicLoading, $ionicHistory, toaster, docketdetailservice) {
    //$rootScope.survey = false;
    $ionicLoading.show({
        content: 'Loading',
        animation: 'fade-in',
        showBackdrop: true,
        maxWidth: 200,
        showDelay: 0
    });
    debugger;
    if ($stateParams.Button == "PodDetails") {
        $scope.button = "POD Details";
    } else if ($stateParams.Button == "SURVEY") {
        $scope.button = "Survey";
    } else if ($stateParams.Button == "PPOD") {
        $scope.button = "PPOD";
    } else if ($stateParams.Button == "MANAGER") {
        $scope.button = "Manager POD";
    }

    $scope.winHeight = $window.innerHeight;

    angular.element($window).bind('resize', function () {
        $scope.winHeight = $window.innerHeight;
        $scope.$apply();
    })



    $scope.selectData = function (docketDetailList) {
        if (docketDetailList) {
            debugger;


            if (docketDetailList.Pickup.ButtonName != "" && docketDetailList.Pickup.ButtonName != null) {

                $scope.itemSelected = docketDetailList.Pickup;

            } else {

                for (var i in docketDetailList.Delivery) {

                    if (docketDetailList.Delivery[i].ButtonName != '') {

                        $scope.itemSelected = docketDetailList.Delivery[i];

                        return

                    }

                }
            }
        }

        if (!$scope.itemSelected) {

            if (docketDetailList.IsCOD) {
                $scope.itemSelected = docketDetailList.Delivery[0];
            }

        }

    }


    $scope.docketDetailByDriverID = function () {
        debugger;
        var input = { driverID: JSON.parse(localStorage.driver).DriverID, X3DriverCode: JSON.parse(localStorage.driver).AccountCode, X3DocketID: $stateParams.DocketID, Depotcode: localStorage.deptcode, DriverId: localStorage.accode };
        docketdetailservice.docketdetail(input, function (data, status) {
            debugger;
            $ionicLoading.hide();
            if (data.ErrorList.HasError) {
                toaster.pop('error', "Error - " + data.ErrorList.ErrorCode, data.ErrorList.ErrorMessage);
                return false;
            }
            debugger;
            $scope.docketDetailList = data.Data;
            $scope.selectData($scope.docketDetailList);

            // console.log($scope.docketDetailList);
            // console.log($scope.docketDetailList.IsRevETA);
            // console.log($scope.docketDetailList.DeliverBy);
            // console.log($scope.docketDetailList.Delivery[0].DropDeliveryDate);
            // // var revETA = ($scope.docketDetailList.IsRevETA == true);
            // // console.log($scope.docketDetailList.IsRevETA == true);
            // // console.log(localStorage.docketETALen);

            // var revETA = 0
            
            // if ($scope.docketDetailList.IsRevETA == false){
            //     revETA = revETA + 1
            //   }

            // console.log(revETA);
            
            
            // if (localStorage.docketETALen){
            //   if (($scope.docketDetailList.IsRevETA == true) > (localStorage.docketETALen)){
            //   // if ($scope.docketDetailList.DeliverBy != $scope.docketDetailList.Delivery[0].DropDeliveryDate){  
            //     var audio = new Audio('audio/Alert.mp3');
            //     audio.play();
            //     // var src = "/android_asset/www/audio/Alert.mp3";
            //     // var media = $cordovaMedia.newMedia(src);
            //     // media.play();
            //   }
            // }

            // localStorage.docketETALen = ($scope.docketDetailList.IsRevETA == true).length;
            // console.log(localStorage.docketETALen);

        }, function (errData, errStatus) {
            //toaster.pop('error', "Network Error!", "Check your Network Connection!");
            $ionicLoading.hide();
        });
    }

    $scope.docketDetailByDriverID();

    $scope.delSelected = function (item, index) {

        if (item.ButtonName != '' && item.ButtonName != 'WAITING FOR PICKUP') {
            $scope.itemSelected = item;
        }

    }

    $scope.completedDoc = function (state) {
        debugger;
        $rootScope.podSate = state;
        if (state == 'notes') {
            $rootScope.notes = $scope.docketDetailList.Notes;
        } else {
            $rootScope.notes = "";
        }

        $state.go("app.poddetails", { DocketID: $scope.docketDetailList.DocketID });



    }

    $scope.submitDel = function (list) {
        debugger;
        if (list.Status != "POD" && !list.IsDriverPODComplete) {

            $ionicLoading.show({
                content: 'Loading',
                animation: 'fade-in',
                showBackdrop: true,
                maxWidth: 200,
                showDelay: 0
            });


            var delItem = {
                "DocketId": $scope.docketDetailList.SageJobId,
                "AddressId": $scope.itemSelected.AddressID,
                "Signature": "",
                "Name": "",
                "NoOfPackagesDelivered": "",
                "Comments": "",
                "Status": $scope.itemSelected.ButtonName,
                "IsCOD": $scope.docketDetailList.IsCOD,
                "IsDriverPOD": $scope.docketDetailList.IsDriverPODComplete,
                "IsCustomerPOD": $scope.docketDetailList.IsCustomerPODComplete,
                "IsManagerPOD": $scope.docketDetailList.IsManagerPODComplete,
                "CashReceived": "",
                "DriverSignature": "",
                "CashReturned": "",
                "PODName": "",
                "ManagerSignature": "",
                "DiscrepComments": "",
                "CustomerAccountCode": $scope.docketDetailList.Customer.CustomerAccountCode,
                "DriverId": localStorage.accode,
                "Depotcode": localStorage.deptcode
            }

            if ((delItem.Status == "PPOD" && $scope.docketDetailList.IsMultiDrop) || (delItem.Status == "PPOD" && $scope.docketDetailList.WaitAndReturn)) {

                $ionicLoading.hide();
                debugger;
                $state.go("app.pod", { DocketID: $scope.docketDetailList.SageJobId, AddressID: $scope.itemSelected.AddressID, Status: $scope.itemSelected.ButtonName, PackageExpected: $scope.itemSelected.NoOfPackages, WaitAndReturn: $scope.itemSelected.DropOrder == 2 && $scope.docketDetailList.WaitAndReturn ? true : false, cutomerID: $scope.docketDetailList.Customer.CustomerAccountCode, CtRn: $scope.docketDetailList.TrackingID  });

            } else if (delItem.Status == "POD" && $scope.docketDetailList.IsCOD) {

                $ionicLoading.hide();
                $state.go("app.DriverPod", { DocketID: $scope.docketDetailList.DocketID, AddressID: $scope.itemSelected.AddressID, Status: $scope.itemSelected.ButtonName, CashExpected: $scope.docketDetailList.CashExpected, PackageExpected: $scope.docketDetailList.Packages, CtRn: $scope.docketDetailList.TrackingID  });

            } else if (delItem.Status == "POD") {
                $ionicLoading.hide();
                debugger;
                $state.go("app.pod", {
                    DocketID: $scope.docketDetailList.SageJobId, AddressID: $scope.itemSelected.AddressID, Status: $scope.itemSelected.ButtonName, PackageExpected: $scope.itemSelected.NoOfPackages, WaitAndReturn: $scope.itemSelected.DropOrder == 2 && $scope.docketDetailList.WaitAndReturn ? true : false, cutomerID: $scope.docketDetailList.Customer.CustomerAccountCode, ctRN: 10 
                });

            } else {

                docketdetailservice.postdocketstatus(delItem, function (data, status) {
                    $ionicLoading.hide();
                    debugger;
                    if (data.ErrorList) {
                        if (data.ErrorList.HasError) {
                            $scope.docketDetailByDriverID();
                            return false;
                        }
                    }
                    $scope.docketDetailList = data.Data;
                    $scope.selectData($scope.docketDetailList);

                    //if ($scope.docketDetailList) {


                    //    for (var i in $scope.docketDetailList.Delivery) {

                    //        if ($scope.docketDetailList.Delivery[i].ButtonName != '') {

                    //            $scope.itemSelected = $scope.docketDetailList.Delivery[i]
                    //            return

                    //        }

                    //    }
                    //}

                }, function (errData, errStatus) {
                    //toaster.pop('error', "Network Error!", "Check your Network Connection!");
                    $ionicLoading.hide();

                });
            }

        } else if (list.IsCOD) {

            if (!list.IsCustomerSurveyComplete) {
                $state.go("app.survey", { DocketID: $scope.docketDetailList.DocketID, AddressID: $scope.docketDetailList.Delivery[0].AddressID, Status: "POD", PackageExpected: $scope.docketDetailList.Packages });
            } else if (!list.IsCustomerPODComplete) {
                $rootScope.preState = "app.survey"

                $rootScope.survey = true;
                $state.go("app.pod", { DocketID: $scope.docketDetailList.DocketID, AddressID: $scope.docketDetailList.Delivery[0].AddressID, Status: "POD", PackageExpected: $scope.itemSelected.NoOfPackages, CtRn: $scope.docketDetailList.TrackingID });
            } else if (!list.IsManagerPODComplete) {
                $state.go("app.ManagerPod", { DocketID: $scope.docketDetailList.DocketID, AddressID: $scope.docketDetailList.Delivery[0].AddressID, Status: "POD", CashExpected: $scope.docketDetailList.CashExpected });
            }
        }
    }

    //Call Controller
    $scope.$on('callController', function (event, data) {
        $scope.docketDetailList
        console.log($scope.docketDetailList);
        var atag = document.createElement("a");
        atag.href = "tel:" + $scope.docketDetailList.ControllerMobile;
        atag.click();


    });

    // Call to Customer

    $scope.$on('callControllerCust', function (event, data) {
      alert('notes');
        $scope.docketDetailList;
        console.log($scope.docketDetailList);
        var atag = document.createElement("a");
        atag.href = "tel:" + $scope.docketDetailList.Delivery[0].PhoneNumber;
        atag.click();
    });

    // Notes Pop-up

    $scope.$on('callNotes', function (event, data) {
        var dlist = $scope.docketDetailList
        console.log($scope.docketDetailList);
        console.log(dlist);
        // var atag = document.createElement("a");
        // atag.href = "tel:" + $scope.docketDetailList.Delivery[0].PhoneNumber;
        // atag.click();
    });


    $scope.gotoMap = function (addType, pickupLat, pickupLong, delLat, delLong) {
        debugger;
        $scope.docketDetailList;
        $state.go("app.map", { addType: addType, pickupLat: pickupLat, pickupLong: pickupLong, delLat: delLat, delLong: delLong });

    }

});