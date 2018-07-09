rico.controller('completeCtrl', function ($scope, $ionicLoading, toaster, completedlistservice) {
    $ionicLoading.show({
        content: 'Loading',
        animation: 'fade-in',
        showBackdrop: true,
        maxWidth: 200,
        showDelay: 0
    });
    var input = { driverID: JSON.parse(localStorage.driver).DriverID, X3DriverCode: JSON.parse(localStorage.driver).AccountCode }
    completedlistservice.completedlist(input, function (data, status) {
      debugger;
        $ionicLoading.hide();
        $scope.completedListData = data.Data;

    }, function (errData, errStatus) {
        //toaster.pop('error', "Network Error!", "Check your Network Connection!");
        $ionicLoading.hide();
    });
});
