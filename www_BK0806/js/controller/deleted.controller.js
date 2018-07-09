rico.controller('deletedCtrl', function ($scope, $state, $stateParams, $ionicLoading, toaster, messageservice) {
       
    
    $scope.Initdeleted = function () {
       

        messageservice.deleted(JSON.parse(localStorage.driver).DriverID, function (data, status) {
            try {

                $scope.deletedData = data.Data;
                
            } catch (e) {

            }

        }, function (errData, errStatus) {
            
        });
    }
    $scope.Initdeleted();

   

});