rico.controller('docketdetailCtrl', function ($scope, $window, $rootScope, $state, $stateParams, $ionicLoading, $ionicHistory, $ionicPopup, toaster, docketdetailservice) {
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
            console.log($scope.docketDetailList);
            
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
                "NoOfPackagesDelivered": $scope.docketDetailList.Packages,
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
            console.log(list.Status);
            console.log(delItem.Status);

            if ((delItem.Status == "PPOD" && $scope.docketDetailList.IsMultiDrop) || (delItem.Status == "PPOD" && $scope.docketDetailList.WaitAndReturn)) {

                $ionicLoading.hide();
                debugger;
                $state.go("app.pod", { DocketID: $scope.docketDetailList.SageJobId, AddressID: $scope.itemSelected.AddressID, Status: $scope.itemSelected.ButtonName, PackageExpected: $scope.itemSelected.NoOfPackages, WaitAndReturn: $scope.itemSelected.DropOrder == 2 && $scope.docketDetailList.WaitAndReturn ? true : false, cutomerID: $scope.docketDetailList.Customer.CustomerAccountCode, CtRn: $scope.docketDetailList.TrackingID });

            } else if (delItem.Status == "POD" && $scope.docketDetailList.IsCOD) {

                $ionicLoading.hide();
                $state.go("app.DriverPod", { DocketID: $scope.docketDetailList.DocketID, AddressID: $scope.itemSelected.AddressID, Status: $scope.itemSelected.ButtonName, CashExpected: $scope.docketDetailList.CashExpected, PackageExpected: $scope.docketDetailList.Packages, CtRn: $scope.docketDetailList.TrackingID });

            } else if (delItem.Status == "POD") {
                $ionicLoading.hide();
                debugger;
                $state.go("app.pod", {
                    DocketID: $scope.docketDetailList.SageJobId, AddressID: $scope.itemSelected.AddressID, Status: $scope.itemSelected.ButtonName, PackageExpected: $scope.itemSelected.NoOfPackages, WaitAndReturn: $scope.itemSelected.DropOrder == 2 && $scope.docketDetailList.WaitAndReturn ? true : false, cutomerID: $scope.docketDetailList.Customer.CustomerAccountCode, ctRN: 10
                });

            } else {

                //---START POB CONFIRM POPUP-----------------Murali-------------------------
                if (delItem.Status == "POB") {

                    $ionicLoading.hide();

                    if ($scope.docketDetailList.Packages > 1) {

                        var confirmPopup = $ionicPopup.confirm({
                            title: 'POB',
                            template: 'Have you collected ' + $scope.docketDetailList.Packages + ' packages?',
                            //template: 'Are you sure want to confirm? <br> Enter Package :<input type="text" > '
                            //template: '<label class="item-input1"><span class="input-label1"><b>Enter Package</b></span><b><input type="text" class="input-type" name="package" required></b></label>'

                            buttons: [
                                { text: 'No' }, {
                                    text: '<b>Yes</b>',
                                    type: 'button-positive',
                                    onTap: function (e) {
                                      return true
                                    }
                                }
                            ]

                        });

                        confirmPopup.then(function (res) {
                          console.log(res);
                            if (res) {

                                $ionicLoading.show({
                                    content: 'Loading',
                                    animation: 'fade-in',
                                    showBackdrop: true,
                                    maxWidth: 300,
                                    showDelay: 0
                                });
                                //alert('Confirm POB');
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

                                    // Re-Direct from Details page to List Page

                                    if (delItem.Status == "POB") {
                                        $ionicLoading.hide();
                                        $state.go("app.docketlist");

                                    }

                                }, function (errData, errStatus) {
                                    //toaster.pop('error', "Network Error!", "Check your Network Connection!");
                                    $ionicLoading.hide();

                                });

                            }
                            else {
                                $ionicLoading.hide();
                                //e.preventDefault();
                                return false;
                            }
                        });
                    }
                    else
                    {
                        $ionicLoading.show({
                            content: 'Loading',
                            animation: 'fade-in',
                            showBackdrop: true,
                            maxWidth: 300,
                            showDelay: 0
                        });
                        
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

                            // Re-Direct from Details page to List Page

                            if (delItem.Status == "POB") {
                                $ionicLoading.hide();
                                $state.go("app.docketlist");

                            }

                        }, function (errData, errStatus) {
                            //toaster.pop('error', "Network Error!", "Check your Network Connection!");
                            $ionicLoading.hide();

                        });
                    }
                }//----END POB CONFIRM POPUP-------------------------------------------------------
                else {
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

                        // Re-Direct from Details page to List Page

                        if ((delItem.Status == "Accept") || (delItem.Status == "POB")) {
                            $ionicLoading.hide();
                            $state.go("app.docketlist");

                        }


                        // $state.go("app.docketlist");

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
        var atag = document.createElement("a");
        atag.href = "tel:" + $scope.docketDetailList.ControllerMobile;
        atag.click();


    });

    // Call to Customer

    $scope.$on('callControllerCust', function (event, data) {
        $scope.docketDetailList;
        var atag = document.createElement("a");
        atag.href = "tel:" + $scope.docketDetailList.Delivery[0].PhoneNumber;
        atag.click();
    });

    // Notes Pop-up

    $scope.notes = function(data){
        console.log(data);
        var confirmPopup = $ionicPopup.show({
          title: 'Notes',
          template: data,

          buttons: [
            { text: 'OK',
            type: 'button-positive' }
         ]

        });
    }


    $scope.gotoMap = function (addType, pickupLat, pickupLong, delLat, delLong) {
        debugger;
        $scope.docketDetailList;
        $state.go("app.map", { addType: addType, pickupLat: pickupLat, pickupLong: pickupLong, delLat: delLat, delLong: delLong });

    }

});