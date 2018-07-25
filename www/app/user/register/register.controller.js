/* global expires */
/* global auth */
(function() {
	"use strict";

	angular
		.module("app.user")
		.controller("RegisterController", RegisterController);

	RegisterController.$inject = ["$state", "$http", "$scope", "$ionicNativeTransitions", "$ionicHistory", "Codes", "fbAuth", "fbUtilities", "authService", "loaderService", "geoService", "getClientIp", "logger", "NativeDeviceStorage"];

	/* @ngInject */
	function RegisterController($state, $http, $scope, $ionicNativeTransitions, $ionicHistory, Codes, fbAuth, fbUtilities, authService, loaderService, geoService, getClientIp, logger, NativeDeviceStorage) {
		var vm = this;

		var _timeStamp = authService.fbTimeStamp();
		var _ipAddress = "";
		getClientIp.async().then(function(data) {
			vm.response = data;
			_ipAddress = vm.response.data.ip;
		});

		vm.emailPattern = authService.emailRegExFilter();
		vm.register = register;

		// TODO - Integrate with FullContact: https://www.fullcontact.com/developer/complete/?key=bcb462a02eb62a76&rate=500&rateLimit=1%2C60
		// https://api.fullcontact.com/v2/person.json?email=jaredwuliger@yahoo.com&apiKey=bcb462a02eb62a76
		function register(user) {
			vm.error = null;
			var email = user.email;
			var pass = user.password;
			$scope.profileData = user.userName;
			// create a user profile in our data store
			loaderService.showLoader("Please wait...", "");
			// geoService.getCurrentPosition(function(position) {
			// 	if (position.coords.latitude) {
					var lat = 0; // position.coords.latitude;
					var long = 0; //position.coords.longitude;

					// create user credentials in Firebase auth system
					return fbAuth.$createUser({ email: email, password: pass })
						.then(function() {
							// authenticate so we have permission to write to Firebase
							return fbAuth.$authWithPassword({ email: email, password: pass });
						})
						.then(function(user) {
							var ref = fbUtilities.ref("users", user.authGroup);
							var refProfile = fbUtilities.ref("userProfiles", user.authGroup);
							return fbUtilities.handler(function(cb) {
								ref.set(authService.passwordUserObject(user, _timeStamp, _timeStamp), cb);
								var profileObj = authService.passwordUserProfileObject(user, $scope.profileData, lat, long, _ipAddress);
								NativeDeviceStorage.set(profileObj);
								refProfile.set(profileObj, cb);
								authService.redirectUser();
							});
						})
						.then(function() {
							authService.redirectUser();
						}, function(error) {
							Codes.showMessage("The specified email address is already in use", 4000);
							logger.log("User Registration Error", error);
						});

			// 	}
			// });
		}

	};
})();