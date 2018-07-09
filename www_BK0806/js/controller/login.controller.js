rico.controller('loginCtrl', function ($scope, $window, $cordovaPush, $stateParams, $state, $rootScope, $ionicLoading, toaster, loginservice) {

    //alert(JSON.stringify(screen.orientation));
    window.addEventListener("orientationchange", function () {
        //alert(JSON.stringify(screen.orientation));
        // Announce the new orientation number
        //location.reload();

    }, false);

    $scope.hasError = false;
    $scope.loginData = {};
    $scope.errorMsg = "";
    debugger;
    //alert($window.innerHeight);
    //if ($window.innerHeight < 400) {
    $scope.winHeight = $window.innerHeight;

    var mql = window.matchMedia("(orientation: portrait)");

    angular.element($window).bind('resize', function () {
        $scope.winHeight = $window.innerHeight;
        $scope.$apply();
    })
    $scope.doLogin = function (loginForm) {
        debugger;
        $scope.errorMsg = "";
        if (loginForm.$invalid) {
            loginForm.$setPristine();
            $scope.hasError = true;
            return false;
        }

        //$scope.startTime = new Date();
        //toaster.pop('warning', "Start", "Start Time for Login!" + new Date());



        $ionicLoading.show({
            content: 'Loading',
            animation: 'fade-in',
            showBackdrop: true,
            maxWidth: 200,
            showDelay: 0
        });
        debugger;
        $scope.loginData.RegistrationID = $rootScope.deviceRegId ? $rootScope.deviceRegId : "";
        //alert("login Data : " + JSON.stringify($scope.loginData));
        loginservice.login($scope.loginData, function (data, success) {

            $ionicLoading.hide();
            //$scope.endTime = new Date();data.Data.DriverID
            //toaster.pop('warning', "END", "End Time for Login!" + new Date() + " Diffrence = " + (($scope.endTime.getTime() - $scope.startTime.getTime()) / 1000) + " sec");

            console.log('Login');
            console.log(data.Data);
            //if (data.ResponseStatus == 1) {
            if (data.Data == null) {
                //if (data.ErrorList.HasError) {
                if (data.Data == null) {
                    $scope.errorMsg = "*Invalid Login";
                }

            }

                //else if (data.ResponseStatus == 0) {
            else if (data.Data.DriverID == 0) {
                if (data.Data.DriverID == 0) {
                    $scope.errorMsg = "*Invalid Login";
                }
            }

            else if (data.Data.LoginFlag == 1) {
                if (data.Data.LoginFlag == 1) {
                    $scope.errorMsg = "*User Already LoggedIn";
                }
            }
            else if (data.Data.DriverID != 0) {
                if (!data.ErrorList.HasError) {

                    localStorage.driver = JSON.stringify(data.Data);
                    localStorage.accode = data.Data.AccountCode;
                    localStorage.deptcode = data.Data.Depotcode;
                    localStorage.DepotID = data.Data.DepotID;
                    // console.log(data.Data);
                    // console.log(localStorage.deptID);
                    $rootScope.$emit('logindetail', true);
                    $state.go("app.docketlist");

                }
            }


        }, function (data, status) {

            //$scope.endTime = new Date();
            //toaster.pop('error', "Error", "Network Error!" + new Date() + " Diffrence = " + (($scope.endTime.getTime() - $scope.startTime.getTime()) / 1000) + " sec");
            $ionicLoading.hide();
            $scope.errorMsg = "*Network Error";

        });

    }


});