(function() {
	"use strict";

	angular
		.module("app.core")
		.controller("AppController", AppController);

	AppController.$inject = ["$rootScope", "$scope", "$state", "$ionicPlatform", "authService", "userProfileDataLocalStorageKey", "$window", "$cordovaSocialSharing", "NativeDeviceStorage"];

	/* @ngInject */
	function AppController($rootScope, $scope, $state, $ionicPlatform, authService, userProfileDataLocalStorageKey, $window, $cordovaSocialSharing, NativeDeviceStorage) {

		$scope.$on("$ionicView.enter", function() {
			NativeDeviceStorage.get().then(function(data) {
				$scope.userProfile = data;
				if ($scope.userProfile) {
					$rootScope.userId = $scope.userProfile.userId;
				}
			});

			$scope.logout = logout;
			function logout() {
				$scope.userProfile = "";
				authService.logout();
			}
		});

		document.addEventListener("deviceready", function() {
			$scope.shareWithOptions = shareWithOptions;

			function shareWithOptions() {
				// this is the complete list of currently supported params you can pass to the plugin (all optional)
				var options = {
					message: "You have got to see this new app I am using called Request It!", // not supported on some apps (Facebook, Instagram)
					subject: "Hey, check it out", // fi. for email
					files: ["https://res.cloudinary.com/requestit/image/upload/v1462573124/Request%20It%20Brand/Icon_Logo_512x512.png"], // an array of filenames either locally or remotely
					url: "http://www.requestit.co/",
					chooserTitle: "Pick an app" // Android only, you can override the default share sheet title
				};
				var onSuccess = function(result) {
					console.log("Share completed? " + result.completed); // On Android apps mostly return false even while it's true
					console.log("Shared to app: " + result.app); // On Android result.app is currently empty. On iOS it's empty when sharing is cancelled (result.completed=false)
				};
				var onError = function(msg) {
					console.log("Sharing failed with message: " + msg);
				};
				window.plugins.socialsharing.shareWithOptions(options, onSuccess, onError);
			};
		});
	}
})();