rico.controller('browseCtrl', function ($scope,$location) {
    
    $scope.messageData = [];
    $scope.messageList = [{
        SenderName: "Varun",
        ReceivedOn: "2016-05-12T02:10:10",
        Content:"deliver the docket to customer ravi @chennai"
        
    },
    {
        SenderName: "Arun",
        ReceivedOn: "2016-05-12T02:10:10",
        Content: "deliver the docket to customer priya @coimbatore"

    },
    {
        SenderName: "Ravi",
        ReceivedOn: "2016-05-12T03:15:15",
        Content: "when will you deliver the docket"

    },
    {
        SenderName: "Priya",
        ReceivedOn: "2016-05-12T04:20:10",
        Content: "whether cash on delivery is available..?"

    }];
    
    //$rootScope.msgList[];
    //msgList= $scope.messageList;
    //console.log($rootScope.msgList);
    console.log($scope.messageList);
    $scope.gotoMessage=function()
    {
        
        $location.path('#/app/message');
        //$location.href="#/app/message.html";
    
}
});
