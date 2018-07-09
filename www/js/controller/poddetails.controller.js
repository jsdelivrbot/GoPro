rico.controller('poddetailsCtrl', function ($scope, $state, $rootScope, $stateParams, $ionicLoading, toaster, poddetailsservice) {

    if ($rootScope.podSate == 'notes') {
        $scope.enableNotes = true;
        $scope.notes = $rootScope.notes;
        $scope.title = 'Notes';
    } else {
        $scope.title = 'POD Details';
        $scope.enableNotes = false;
    }

    $ionicLoading.show({
        content: 'Loading',
        animation: 'fade-in',
        showBackdrop: true,
        maxWidth: 200,
        showDelay: 0
    });
    poddetailsservice.getPoddetails($stateParams.DocketID, function (data, status) {
        debugger;
        $scope.poddetails = data.Data;
        console.log(data);
        $ionicLoading.hide();


    }, function (data, status) {
        //toaster.pop('error', "Network Error!", "Check your Network Connection!");
        $ionicLoading.hide();

    })

});