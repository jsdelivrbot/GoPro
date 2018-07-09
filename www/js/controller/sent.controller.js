rico.controller('sentCtrl', function ($scope, $state, $stateParams, $ionicLoading, toaster, messageservice) {

    
    $scope.Initsent = function () {
       
        messageservice.sent(JSON.parse(localStorage.driver).DriverID, function (data, status) {
            try {

                $scope.sentData = data.Data;

            } catch (e) {

            }

        }, function (errData, errStatus) {
            //toaster.pop('error', "Network Error!", "Check your Network Connection!");
        });
    }
    $scope.Initsent();




});