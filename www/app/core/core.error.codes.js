(function() {
	"use strict";

	angular
		.module("app.core")
		.factory("Codes", Codes);

	Codes.$inject = ["$ionicLoading", "$timeout", "$q"];

	/* @ngInject */
	function Codes($ionicLoading, $timeout, $q) {
		var self = this;

		self.handleError = function(error) {
			self.showMessage(self.getErrorMessage(error), 1500);
		};

		self.showMessage = function(message, optHideTime) {
			if (optHideTime != undefined && optHideTime > 100) {
				// error message or notification (no spinner)
				$ionicLoading.show({
					template: message
				});
				$timeout(function() {
					$ionicLoading.hide();
				}, optHideTime);
			} else {
				// loading (spinner)
				$ionicLoading.show({
					template: message + "<br><br>" + '<ion-spinner class="spinner-modal"></ion-spinner>'
				});

				$timeout(function() { // close if it takes longer than 10 seconds
					$ionicLoading.hide();
				}, 20000);
			}
		};

		self.getErrorMessage = function(error) {
			var updateMessage;
			console.log(error);
			if (error.hasOwnProperty("code")) {
				switch (error.code) {
					case "INVALID_USER":
						//
						updateMessage = "User does not exist... Sign up!";
						break;
					case "INVALID_EMAIL":
						//
						updateMessage = "Invalid E-mail. Try again";
						break;
					case "INVALID_PASSWORD":
						//
						updateMessage = "Incorrect password";
						break;
					case "INVALID_INPUT":
						//
						updateMessage = "Invalid E-mail or password. Try again";
						break;
					case "EMAIL_TAKEN":
						//
						updateMessage = "E-mail is already taken. Forgot password? Reset it";
						break;
					case "USERNAME_TAKEN":
						//
						updateMessage = "Username is already taken. Try again";
						break;
					case "USERNAME_NONEXIST":
						//
						updateMessage = "User not found. Check your spelling";
						break;
					case "PROFILE_NOT_SET":
						//
						updateMessage = "Please provide an username and display name";
						break;
					case "AUTHENTICATION_DISABLED":
						//
						updateMessage = "The requested authentication provider is disabled for this Firebase application.";
						break;
					case "INVALID_ARGUMENTS":
						//
						updateMessage = "The specified credentials are malformed or incomplete. Please refer to the error message, error details, and Firebase documentation for the required arguments for authenticating with this provider.";
						break;
					case "INVALID_CONFIGURATION":
						//
						updateMessage = "The requested authentication provider is misconfigured, and the request cannot complete. Please confirm that the provider's client ID and secret are correct in your App Dashboard and the app is properly set up on the provider's website.";
						break;
					case "INVALID_CREDENTIALS":
						//
						updateMessage = "The specified authentication credentials are invalid. This may occur when credentials are malformed or expired.";
						break;
					case "INVALID_ORIGIN":
						//
						updateMessage = "A security error occurred while processing the authentication request. The web origin for the request is not in your list of approved request origins. To approve this origin, visit the Login & Auth tab in your App Dashboard.";
						break;
					case "INVALID_PROVIDER":
						//
						updateMessage = "The requested authentication provider does not exist. Please consult the Firebase Authentication documentation for a list of supported providers.";
						break;
					case "INVALID_TOKEN":
						//
						updateMessage = "The specified authentication token is invalid. This can occur when the token is malformed, expired, or the Firebase app secret that was used to generate it has been revoked.";
						break;
					case "NETWORK_ERROR":
						//
						updateMessage = "An error occurred while attempting to contact the authentication server.";
						break;
					case "USER_CANCELLED":
						//
						updateMessage = "The current authentication request was cancelled by the user.";
						break;
					case "USER_DENIED":
						//
						updateMessage = "The user did not authorize the application. This error can occur when the user has cancelled an OAuth authentication request.";
						break;
					default:
						//
						updateMessage = "Oops. Something went wrong...";
						break;
				}
			} else {
				updateMessage = "Oops. Something went wrong...";
			}
			return updateMessage;
		};

		/**
		 * Generic function to validate input
		 */
		self.validateInput = function(inputValue) {
			var qVal = $q.defer();
			switch (inputValue) {
			case undefined:
				handleValidation("INPUT_UNDEFINED", false);
				break;
			case null:
				handleValidation("INPUT_NULL", false);
				break;
			case "":
				handleValidation("INPUT_NULL", false);
				break;
			default:
				handleValidation("INPUT_VALID", true);
				break;
			}

			function handleValidation(code, pass) {
				if (pass) {
					qVal.resolve(code);
				} else {
					qVal.reject(code);
				}
			};

			return qVal.promise;
		};

		return self;
	}

})();