'use strict';

rico.factory('surveyservice', function ($rootScope, $http) {

    var service = {

        getsurveyquestions: function (data, success, failure) {

            $http.get(baserURL() + "Docket/GetFeedbackQuestionsAnswers" + data).success(success).error(failure);
            },
        postsurveyanswer: function (data, success, failure) {

            $http.post(baserURL() + "Docket/SaveFeedback", data).success(success).error(failure);
          
            
        }
    }

    return service;
});
