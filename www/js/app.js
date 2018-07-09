// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
var rico = angular.module('starter', ['ionic', 'signature', 'toaster', 'ngCordova', 'sw2.ionic.password-show-hide']);

rico.run(function ($window, $ionicPlatform, $cordovaMedia, $cordovaPushV5, $cordovaDevice, $state, $rootScope, globalfactory, $location, $timeout, $ionicNavBarDelegate, $ionicSideMenuDelegate, $ionicHistory, toaster) {


    // initialize
    $ionicPlatform.ready(function () {
        var options = {
            android: {
                // senderID: "868500522380",
                senderID: "246388735668",
                alert: "true",
                badge: "true",
                sound: "true"
            },
            ios: {
                alert: "true",
                badge: "true",
                sound: "true"
            },
            windows: {}
        };
        // alert("device : " + JSON.stringify($cordovaDevice.getDevice()));

        //alert("cordova : " + $cordovaDevice.getCordova());

        //alert("model : " + $cordovaDevice.getModel());

        //alert("Platform : " + $cordovaDevice.getPlatform());

        // alert("UUID : " + $cordovaDevice.getUUID());

        //alert("version : " + $cordovaDevice.getVersion());

        function callback(imei) {
           console.log("My Android IMEI :" + imei);
        }

        //window.plugins.imeiplugin.getImei(callback);
            $cordovaPushV5.initialize(options).then(function () {
              // console.log('push');
                //start listening for new notifications
                $cordovaPushV5.onNotification();
                // start listening for errors
                $cordovaPushV5.onError();

                //register to get registrationId
                $cordovaPushV5.register().then(function (registrationId) {
                    //alert(registrationId);
                    $rootScope.deviceRegId = registrationId;
                    // save `registrationId` somewhere;
                });
            });

    });

    // triggered every time notification received
    $rootScope.$on('$cordovaPushV5:notificationReceived', function (event, data) {
        // toaster.pop('success', "Notification", data.message);
        console.log(data);
        debugger;
        if (data.additionalData.foreground === false) {
            toaster.pop('success', "Notification", data.message);
            if (data.message == "New message received") {
                $state.go("app.inbox");
                $rootScope.$emit('inboxReceived', true);
            } else {
                $state.go("app.docketlist");
                $rootScope.$emit('docketReceived', true);
            }

        } else {
            toaster.pop('success', "Notification", data.message);
            if (data.message == "New message received") {
                $rootScope.$emit('inboxReceived', true);
            } else {
                $rootScope.$emit('docketReceived', true);
            }

        }


        //alert(JSON.stringify(data));

    });

    // triggered every time error occurs
    $rootScope.$on('$cordovaPushV5:errorOcurred', function (event, e) {
        alert("push errorOcurred");
    });


    $rootScope.online = navigator.onLine;
    $window.addEventListener("offline", function () {
        $rootScope.$apply(function () {
            $rootScope.online = false;
        });
    }, false);
    $window.addEventListener("online", function () {
        $rootScope.$apply(function () {
            $rootScope.online = true;
        });
    }, false);

    $ionicPlatform.ready(function () {
        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)

        // Disble for Mobile View Start  
        // if (window.cordova && window.cordova.plugins.Keyboard) {
        //     cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        //     cordova.plugins.Keyboard.disableScroll(true);

        // }

        // Disble for Mobile View END ///
        
        if (window.StatusBar) {
            // org.apache.cordova.statusbar required
            StatusBar.styleDefault();
        }
        if (!localStorage.driver) {

            $state.go("login");

        } else {
            $state.go("app.docketlist");
        }

        //// listen for Online event
        //$rootScope.$on('$cordovaNetwork:online', function (event, networkState) {

        //    var onlineState = networkState;
        //    alert("online ?: " + onlineState);
        //})

        //// listen for Offline event
        //$rootScope.$on('$cordovaNetwork:offline', function (event, networkState) {

        //    var offlineState = networkState;
        //    alert("offline ?: " + offlineState);
        //})


        $rootScope.showSelect = true;

        //var app = this;
        //app.isChecked = false;

        //$rootScope.sendSelectAll = function () {
        //    $rootScope.$emit('sendSelectAll', true);
        //}

        //$rootScope.selectALL = function () {
        //    debugger;
        //    $rootScope.$emit('selectAll', app.isChecked);
        //}

        //$rootScope.$on('unselectAll', function (event, data) {

        //    app.isChecked = false;
        //});

        $rootScope.$on('$stateChangeSuccess', function (event, toState, toStateParams, fromState, fromParams) {

            if (!localStorage.driver && toState.name != "login") {

                $state.go("login");
                return;
            } else if (localStorage.driver && toState.name == 'login') {
                if (fromState.name == "") {
                    $state.go("app.docketlist");
                } else {
                    $state.go(fromState.name);
                }
                return;
            }

            if (toState.name == "app.docketlist") {
                $rootScope.showSelect = true;
            } else {
                $rootScope.showSelect = false;
            }



        });

        $rootScope.$on('$stateChangeStart', function (event, toState, toStateParams, fromState, fromParams) {
            debugger;
            $rootScope.previousState = fromState;
            if (!$rootScope.survey) {
                $rootScope.preState = $rootScope.previousState.name;
            }


            var path = $location.path();
            //if (path.indexOf('docketlist') != -1) {
            //    $ionicNavBarDelegate.showBackButton(true);
            //}
            //else {
            //    $ionicNavBarDelegate.showBackButton(true);
            //}

        });


    });

})

//rico.config(function($ionicNativeTransitionsProvider){
//    $ionicNativeTransitionsProvider.setDefaultBackTransition({
//        type: 'slide',
//        direction: 'right'
//    });
//});

.config(function ($stateProvider, $ionicConfigProvider, $urlRouterProvider) {


    $ionicConfigProvider.views.maxCache(0);
    $stateProvider
        .state('login', {
            url: '/login',
            views: {
                'main': {
                    templateUrl: 'templates/login.html',
                    controller: 'loginCtrl'
                }
            }
        })
      .state('app', {
          url: '/app',
          abstract: false,
          views: {
              'main': {
                  templateUrl: 'templates/menu.html',
                  controller: 'AppCtrl',
                  controllerAs: 'app'
              }
          }
      })
         .state('app.docketlist', {
             url: '/docketlist',
             views: {
                 'menuContent': {
                     templateUrl: 'templates/docketlist.html',
                     controller: 'docketlistCtrl'
                 }
             }
         })
        .state('app.docketdetail', {
            url: '/docketdetail/:DocketID/:Button',
            views: {
                'menuContent': {
                    templateUrl: 'templates/docketdetail.html',
                    controller: 'docketdetailCtrl'
                }
            }


        })

        .state('app.complete', {
            url: '/complete',
            views: {
                'menuContent': {
                    templateUrl: 'templates/complete.html',
                    controller: 'completeCtrl'
                }
            }
        })
        .state('app.message', {
            url: '/message',
            views: {
                'menuContent': {
                    templateUrl: 'templates/message.html',
                    controller: 'messageCtrl'
                }
            }
        })

        .state('app.search', {
            url: '/search',
            views: {
                'menuContent': {
                    templateUrl: 'templates/search.html'
                }

            }
        })

    .state('app.browse', {
        url: '/browse',
        views: {
            'menuContent': {
                templateUrl: 'templates/browse.html',
                controller: 'browseCtrl'
            }
        }
    })
      .state('app.playlists', {
          url: '/playlists',
          views: {
              'menuContent': {
                  templateUrl: 'templates/playlists.html',
                  controller: 'PlaylistsCtrl'
              }
          }

      })
         //.state('app.message', {
         //    url: '/message',

         //    templateUrl: 'templates/message.html',
         //    controller: 'messageCtrl'
         //})

        .state('app.inbox', {
            url: '/inbox',
            views: {
                'menuContent': {
                    templateUrl: 'templates/inbox.html',
                    controller: 'inboxCtrl'
                }
            }

        })


        .state('app.messagedetail', {
            url: '/messagedetail/:UserID',
            views: {
                'menuContent': {
                    templateUrl: 'templates/messagedetail.html',
                    controller: 'messagedetailCtrl'
                }
            }
        })


         .state('app.compose', {
             url: '/compose',
             views: {
                 'menuContent': {
                     templateUrl: 'templates/compose.html',
                     controller: 'composeCtrl'
                 }
             }
         })

        .state('app.sent', {
            url: '/sent',
            views: {
                'menuContent': {
                    templateUrl: 'templates/Sent.html',
                    controller: 'sentCtrl'
                }
            }

        })

        .state('app.deleted', {
            url: '/deleted',
            views: {
                'menuContent': {
                    templateUrl: 'templates/deleted.html',
                    controller: 'deletedCtrl'
                }
            }

        })

    .state('app.single', {
        url: '/playlists/:playlistId',


    })
        .state('app.ManagerPod', {
            url: '/ManagerPod/:DocketID/:AddressID/:Status/:CashExpected',
            views: {
                'menuContent': {
                    templateUrl: 'templates/ManagerPod.html',
                    controller: 'ManagerPodCtrl'
                }
            }
        })

    .state('app.pod', {
        url: '/pod/:DocketID/:AddressID/:Status/:PackageExpected/:WaitAndReturn/:cutomerID',

        views: {
            'menuContent': {

                templateUrl: 'templates/pod.html',
                controller: 'podCtrl'

            }
        }

    })
    .state('app.DriverPod', {
        url: '/DriverPod/:DocketID/:AddressID/:Status/:CashExpected/:PackageExpected',
        views: {
            'menuContent': {
                templateUrl: 'templates/DriverPod.html',
                controller: 'driverPodCtrl'
            }
        }
    })
    .state('app.survey', {
        url: '/survey/:DocketID/:AddressID/:Status/:PackageExpected',
        views: {
            'menuContent': {
                templateUrl: 'templates/survey.html',
                controller: 'surveyCtrl'
            }
        }
    })
    .state('app.poddetails', {
        url: '/poddetails/:DocketID',
        views: {
            'menuContent': {
                templateUrl: 'templates/poddetails.html',
                controller: 'poddetailsCtrl'
            }
        }
    })
    .state('app.map', {
        url: '/map/:addType/:pickupLat/:pickupLong/:delLat/:delLong',
        views: {
            'menuContent': {
                templateUrl: 'templates/map.html',
                controller: 'mapCtrl'
            }
        }
    })

    // if none of the above states are matched, use this as the fallback
    //$urlRouterProvider.otherwise('/login');
});

rico.controller('MainCtrl', function ($scope, $rootScope, toaster, $ionicPlatform) {

    $ionicPlatform.on('offline', function () {
        alert("Check Internet Connectivity!");
    });
    
    //$scope.$watch(function () {
    //    return $rootScope.online;
    //}, function () {
    //    var status = $rootScope.online;
    //    if ($rootScope.online == false) {
    //        alert("Check Internet Connectivity");
    //    }
    //}, true);
});


function baserURL() {
    //return "RicoHandler.ashx?url=http://10.91.19.234:1987/api/";
    //return "http://10.91.19.234:1987/api/"; 
    //return "RicoHandler.ashx?url=http://111.221.100.59:1900/api/";  //Dev Url
    //return "http://111.221.100.59:1900/api/";
    //return "RicoHandler.ashx?url=http://111.221.100.59:1901/api/mobile/";
    //return "http://111.221.100.59:1901/api/mobile/";
    //return "http://111.221.100.59:1908/api/mobile/";
    //return "http://nxt-lt034:1599/api/mobile/";
    //return "http://10.91.16.201:1599/api/mobile/";
    //return "http://10.91.16.248:1290/api/mobile/"; //Selva
    //return "http://localhost:1802/api/mobile/";
    //return "http://111.221.100.59:1901/api/mobile/"; //UAT
    //return "http://172.24.15.54:8081/api/mobile/"; // NEW UAT
    //return "https://gotest.ricogroup.global/MobileApp/api/mobile/"; // NEW UAT live
    // return "http://gotest.ricogroup.global:8081/api/mobile/"; // NEW UAT live // Rami
    return "http://go.ricogroup.global:8081/api/mobile/"; // Production Server // Rami
    // return "https://go.ricogroup.global/MobileApp/api/mobile/"; // Production Server // Rami
    // return "http://195.88.9.9:8081/api/mobile";
    //return "http://111.221.100.59:1902/api/mobile/"; //DEV
    //return "http://111.221.100.59:1908/api/mobile/"; //TVS
    //return "http://rico-dev:1289/api/mobile/";//TESTING
    //return "http://10.91.19.234:1289/api/mobile/";//TESTING
    //return "http://localhost:1905/api/mobile/"
}

function ValidFileExt(e) {
    debugger;
    var validatedFiles = [];
    if (e.files[0].size > 1 * 1024 * 1024) {
        var rr = document.getElementById('ctl00_TicketContent_MultiFileUpload');

        //$(this).parent(rr).remove();
        //e.MultiFile.list.remove();

        return false;

    }
    else {
        validatedFiles.push(e);
        return true;
    }

}