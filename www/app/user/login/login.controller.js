(function() {
	"use strict";

	// TODO - Integrate with FullContact: https://www.fullcontact.com/developer/complete/?key=bcb462a02eb62a76&rate=500&rateLimit=1%2C60
	// https://api.fullcontact.com/v2/person.json?email=jaredwuliger@yahoo.com&apiKey=bcb462a02eb62a76

	angular
		.module("app.user")
		.controller("LoginController", LoginController);

	LoginController.$inject = ["$scope", "$state", "$timeout", "$ionicModal", "$cordovaInAppBrowser", "authService", "fbUtilities", "Codes", "NativeDeviceStorage"];

	function LoginController($scope, $state, $timeout, $ionicModal, $cordovaInAppBrowser, authService, fbUtilities, Codes, NativeDeviceStorage) {
		var vm = this;

		$scope.emailPattern = authService.emailRegExFilter();
		vm.googleDividerBorder = "1px #C73323 solid";
		vm.facebookDividerBorder = "1px #345296 solid";
		vm.twitterDividerBorder = "1px #1C97CC solid";

		vm.loginWithSocial = loginWithSocial;
		vm.loginPassword = loginPassword;
		vm.openPrivacyPolicy = openPrivacyPolicy;
		vm.openTerms = openTerms;

		$scope.openModal = function() {
			$scope.AuthData = authService.AuthData;

			// communicates with the DOM
			$scope.status = {
				loading: true,
				loadingProfile: true,
				changePasswordMode: "lost"
			};

			$ionicModal.fromTemplateUrl("app/user/login/change-password.html", {
				scope: $scope
			}).then(function (modal) {
				$scope.modal = modal;
				$scope.modal.show();
			});
			$scope.closeModal = function () {
				$scope.modal.hide();
			};

			// Form data for the signUp modal
			$scope.changePasswordData = {};

			// Create the signUp modal that we will use later
			$ionicModal.fromTemplateUrl("app/user/login/change-password.html", {
				scope: $scope
			}).then(function(modal) {
				$scope.modalChangePassword = modal;
			});
			$scope.closeChangePassword = function() {
				$scope.modalChangePassword.hide();
				if ($scope.status.changePasswordMode === "lost") {
					$scope.modal.show();
				}
			};
			$scope.changePassword = function(mode) {
				// when authenticated
				if ($scope.AuthData.hasOwnProperty("password")) {
					$scope.changePasswordData = {
						userEmail: $scope.AuthData.password.email
					};
				}
				$scope.status["changePasswordMode"] = mode;
				$scope.modal.hide();
				$scope.modalChangePassword.show();
			};

			//
			// step 1: reset password
			//
			$scope.resetPassword = function() {
				if ($scope.changePasswordData.userEmail) {
					Codes.showMessage("Resetting password");
					authService.resetPassword(
						$scope.changePasswordData.userEmail).then(
						function(success) {
							Codes.showMessage("Password has been reset. Please check your email for the temporary password", 2000);
							$scope.status["changePasswordMode"] = "change";
						}, function(error) {
							Codes.handleError(error);
						}
					);
				} else {
					Codes.handleError({ code: "INVALID_INPUT" });
				}
			};

			//
			// step 2: change password
			//
			$scope.doChangePassword = function() {
				if ($scope.changePasswordData.userEmail && $scope.changePasswordData.oldPassword && $scope.changePasswordData.newPassword) {
					Codes.showMessage("Changing password... ");
					authService.changePassword(
						$scope.changePasswordData.userEmail,
						$scope.changePasswordData.oldPassword,
						$scope.changePasswordData.newPassword).then(
						function() {
							Codes.showMessage("Password Changed!");
							$scope.modal.hide();
						}, function(error) {
							Codes.handleError(error);
						}
					);
				} else {
					Codes.handleError({ code: "INVALID_INPUT" });
				}
			};
		};

		function loginPassword() {
			vm.userCredentials = {
				email: vm.user.email,
				password: vm.user.password
			};
			authService.loginPassword(vm.userCredentials, { remember: "default" })
				.then(function(response) {
					var ref = fbUtilities.ref("userProfiles", response.authGroup);
					ref.once("value", function(snapshot) {
						var profileObj = snapshot.val();
						NativeDeviceStorage.set(profileObj);
					});
					authService.redirectUser();
				})
				.catch(function(error) {
					Codes.handleError(error);
				});
		}

		function openPrivacyPolicy() {
			console.log("here");
			window.open("https://www.iubenda.com/privacy-policy/7858706", "_blank", "location=yes");
		};

		function openTerms() {
			window.open("http://requestitinc.weebly.com", "_blank", "location=yes");
		};

		function loginWithSocial(provider) {
			switch (provider) {
			case "google":
				vm.options = {
					scope: "email, profile",
					remember: "default"
				};
				break;
			case "facebook":
				vm.options = {
					scope: "public_profile, user_friends, email",
					remember: "default"
				};
				break;
			case "twitter":
				vm.options = {
					scope: "verify_credentials, include_email, email",
					remember: "default"
				};
				break;
			}
			authService.socialLogin(provider, vm.options);
		}
	}

})();