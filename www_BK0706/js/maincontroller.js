
rico
    .controller('AppCtrl', function ($scope, $rootScope, $ionicPlatform, $location, $ionicHistory, $ionicModal, $ionicPopup, $timeout, $state, $rootScope, $filter, $interval, mapservice, toaster, takebreakservice, loginservice, $ionicPopover) {

      $rootScope.$on('myEvent', function (event, data) {
        debugger;
        $scope.msgcount = data;
      });
      //$ionicPlatform.onHardwareBackButton(function () {

      //});

      takebreakservice.unreadMessage(JSON.parse(localStorage.driver).DriverID, function (data, status) {
        debugger;
        //$scope.msgcount = data;
        $scope.msgcount = data;
      }, function (errData, errStatus) {
        //debugger;


      });

      $scope.showGPSAlert = true;
      $ionicPopover.fromTemplateUrl('my-popover.html', {
        scope: $scope
      }).then(function (popover) {

        $scope.popover = popover;
      });

      $scope.openPopover = function ($event) {

        $scope.popover.show($event);
      };

      $scope.closePopover = function () {
        $scope.popover.hide();
      };

      //Cleanup the popover when we're done with it!
      $scope.$on('$destroy', function () {
        $scope.popover.remove();
      });

      // Execute action on hide popover
      $scope.$on('popover.hidden', function () {
        // Execute action
      });

      // Execute action on remove popover
      $scope.$on('popover.removed', function () {
        // Execute action
      });
      // With the new view caching in Ionic, Controllers are only called
      // when they are recreated or on app start, instead of every page change.
      // To listen for when this page is active (for example, to refresh data),
      // listen for the $ionicView.enter event:
      //$scope.$on('$ionicView.enter', function(e) {
      //});

      // Form data for the login modal
      $scope.loginData = {};

      // Take Break
      $scope.break = false;
      $scope.takeBreak = function () {
        $scope.popover.hide();
        $scope.break = !$scope.break;
        var date = new Date();
        $scope.ddMMyyyy = $filter('date')(new Date(), 'yyyy-MM-dd hh:mm');

        var dd = JSON.parse(localStorage.driver);


        var breakin = {
          "DriverID": dd.DriverID,
          "IsBreakStart": $scope.break,
          "StartDate": $scope.ddMMyyyy,
          "EndDate": $scope.ddMMyyyy
        }
        takebreakservice.postbreakstatus(breakin, function (data, status) {


        },
        function (errData, errStatus) {
          //$ionicLoading.hide();
        });

      }

      //Message redirect

      $scope.redirect = function () {
        $scope.popover.hide();
        $state.go("app.inbox");
      }


      //Login detail from localstorage

      if (localStorage.driver) {
        $scope.logindetail = JSON.parse(localStorage.driver);
        //Contact detail to call Controller

        takebreakservice.getContactDetails(JSON.parse(localStorage.driver).DriverID, function (data, status) {

          $scope.ContactDetails = data.Data;

        }, function (errData, errStatus) {

        })
      }


      //EMIT FROM LOGIN


      $rootScope.$on('logindetail', function (event) {

        $scope.logindetail = JSON.parse(localStorage.driver);


      });
      // Create the login modal that we will use later

      //$ionicModal.fromTemplateUrl('templates/login.html', {
      //    scope: $scope
      //}).then(function (modal) {
      //    $scope.modal = modal;
      //});

      $ionicModal.fromTemplateUrl('templates/modal.html', {
        scope: $scope
      }).then(function (modal) {

        $scope.modal = modal;
        $scope.ContactDetails
      });

      // $ionicModal.fromTemplateUrl('templates/modalnote.html', {
      //   scope: $scope
      // }).then(function (modal) {

      //   $scope.modal = modal;
      //   // $scope.ContactDetails
      // });

      // Triggered in the login modal to close it
      $scope.closeLogin = function () {
        $scope.modal.hide();
      };

      // Open the login modal
      $scope.login = function () {
        $scope.modal.show();
      };

      $scope.logflag = function () {
        // $scope.modal.show();
      };

      // Perform the login action when the user submits the login form
      $scope.doLogin = function () {


        // Simulate a login delay. Remove this and replace with your login
        // code if using a login system
        $timeout(function () {
          $scope.closeLogin();
        }, 1000);
      };

      //logout
      $scope.logout = function () {

        var confirmPopup = $ionicPopup.confirm({
          title: 'Logout',
          template: 'Are you sure want to Logout?'

        });
        console.log(JSON.parse(localStorage.driver).DriverID);
        var rami = {
          "LoginFlag": 0,
          "UserID": JSON.parse(localStorage.driver).DriverID
        }

        confirmPopup.then(function (res) {
          if (res) {

            loginservice.loggedout(rami, function (data, status) {
              console.log(rami);
              },
            function (data, status) {
              //$ionicLoading.hide();
            });

            $ionicHistory.nextViewOptions({
              disableBack: true,
              disableAnimate: true,
              historyRoot: true
            });
            $ionicHistory.clearCache();
            $ionicHistory.clearHistory();
            localStorage.clear();
            $timeout.cancel($scope.stopTime);
            $state.go("login");
          }
        });

        // var input = {
        //   "LogFlag": 0
         
        // }
        // loginservice.logflag(input, function (data, success) {
        //       console.log('LoggedOut');
        //     }, function (errData, errStatus) {

        // });

        // var rami = {
        //   "LoginFlag": 6,
        //   "DriverID": JSON.parse(localStorage.driver).DriverID
        // }

        // loginservice.loggedout(rami, function (data, status) {
        //   console.log(data);
        //   },
        // function (data, status) {
        //   //$ionicLoading.hide();
        // });


      }

      //Location Tracking

      $scope.timeoutlocationTracking = function (timeDelay) {

        $scope.stopTime = $timeout(function () {
          $scope.showGPSAlert = false;
          $scope.backgroundLocation();

        }, parseInt(timeDelay * 1000 * 60));

      }

      $scope.backgroundLocation = function () {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(function (position) {
            var newPoint = new google.maps.LatLng(position.coords.latitude,
                                                  position.coords.longitude);

            var locationData = {
              "DriverID": JSON.parse(localStorage.driver).DriverID,
              "XCoordinates": position.coords.latitude,
              "YCoordinates": position.coords.longitude
            }

            mapservice.postBackgroundLocation(locationData, function (data, status) {

              $scope.timeoutlocationTracking(data);


            }, function (errData, errStatus) {
              $scope.timeoutlocationTracking(3);

            });

          }, function (a) {
            if ($scope.showGPSAlert) {
              cordova.dialogGPS();
            }
            $timeout(function () { toaster.pop('info', "GPS!", "Please turn on your GPS to track your location."); }, 5000);
            $scope.timeoutlocationTracking(3);

          }, { timeout: 5000 });


        } else {
          $scope.timeoutlocationTracking(3);
        }
      }
      $scope.backgroundLocation();
      //Call Controller
      $scope.callController = function () {
        $scope.popover.hide();
        if ($state.current.name == "app.docketdetail") {
          $scope.$broadcast('callController', true);
        } else {
          $scope.ContactDetails;
          $scope.modal.show();
        }

      }

      // Call to Customer

      $scope.callControllerCust = function () {
        $scope.popover.hide();
        if ($state.current.name == "app.docketdetail") {
          $scope.$broadcast('callControllerCust', true);
        } else {
          $scope.ContactDetails;
          $scope.modal.show();
        }

      }

      $scope.callNotes = function(){
        // $scope.modal1.show();
        $scope.popover.hide();
        if ($state.current.name == "app.docketdetail") {
          $scope.$broadcast('callNotes', true);
          $scope.modal.show();
        } 
      }


      var app = this;

      app.isChecked = false;

      $scope.sendSelectAll = function () {
        $rootScope.$emit('sendSelectAll', true);
      }

      $scope.selectALL = function () {

        $rootScope.$emit('selectAll', app.isChecked);
      }

      $rootScope.$on('unselectAll', function (event, data) {

        app.isChecked = false;
      });

      $rootScope.$on('$stateChangeSuccess', function (event, toState, toStateParams, fromState, fromParams) {
        app.isChecked = false;
      });

      document.addEventListener("offline", onOffline, false);


      function onOffline() {
        toaster.pop('info', "Mobile Network!", "Please turn on your mobile Data");
      }

    })

.controller('PlaylistsCtrl', function ($scope) {
  $scope.playlists = [
    { title: 'Reggae', id: 1 },
    { title: 'Chill', id: 2 },
    { title: 'Dubstep', id: 3 },
    { title: 'Indie', id: 4 },
    { title: 'Rap', id: 5 },
    { title: 'Cowbell', id: 6 }
  ];
})

.controller('PlaylistCtrl', function ($scope, $stateParams) {
});
