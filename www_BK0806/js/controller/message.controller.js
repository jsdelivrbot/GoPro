rico.controller('messageCtrl', function ($scope, $rootScope, $state) {

    //$scope.Content = $rootScope.msgList[i].Content;

    $scope.navMsg = function (nav) {

        $state.go(nav);

    }

});