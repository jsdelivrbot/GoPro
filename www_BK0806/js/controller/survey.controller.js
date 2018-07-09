rico.controller('surveyCtrl', function ($scope, $stateParams, $state, $location, $ionicLoading, toaster,surveyservice) {
    //$scope.next=function()
    //{
    //    
    //    $location.path("templates/docketlist.html");
    //}
    
    $stateParams.DocketID
    
    $scope.questionlist = {};
    $scope.answers = {};

    //questions.togglevalue
    $scope.togglevalue = {
        value: true,

    }
    $scope.status = {};
    $scope.errorinfo = true;

    $scope.next = function (SurveyForm, questions) {
        
        $scope.errorinfo = true;
        if (SurveyForm.$invalid) {
            SurveyForm.$setPristine();
            return false;
        }
        
        $ionicLoading.show({
            content: 'Loading',
            animation: 'fade-in',
            showBackdrop: true,
            maxWidth: 200,
            showDelay: 0
        });
        for (var i in questions) {

            questions[i].FeedbackAnswerID = questions[i].togglevalue ? 1 : 2;

            if (questions[i].FeedbackAnswerID == 2) {
                //alert("Please enter the feedback");
            }
        }

        surveyservice.postsurveyanswer(questions, function (data, status) {
            $ionicLoading.hide();
            debugger;
            $state.go("app.pod", { DocketID: $stateParams.DocketID, AddressID: $stateParams.AddressID, Status: $stateParams.Status, PackageExpected: $stateParams.PackageExpected });
        }, function (data, status) {
            debugger;
            $ionicLoading.hide();
        });



    },

   surveyservice.getsurveyquestions('', function (data, status) {

       
       $scope.starttime = new Date();
       //toaster.pop('warning', "Start", "Survey Questions!" + new Date());
       $scope.question = data.Data;
       $scope.endtime = new Date();
       //toaster.pop('warning', "END", "Survey Questions!!" + new Date() + " Diffrence = " + (($scope.endtime.getTime() - $scope.starttime.getTime()) / 1000) + " sec");
       //$scope.question.m_Item1[i].togglevalue = true;
       
       for (var i in $scope.question.m_Item1) {
           $scope.question.m_Item1[i].DocketId = $stateParams.DocketID;
           $scope.question.m_Item1[i].FeedbackAnswerID = "";
           $scope.question.m_Item1[i].AnswerText = "";
           $scope.question.m_Item1[i].togglevalue = true;
       }
       $scope.questionlist = data.Data.m_Item1;



   }, function (errData, errStatus) {


   });


});