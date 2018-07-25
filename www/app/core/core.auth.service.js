(function() {
	"use strict";

	angular
		.module("app.core")
		.service("authService", authService);

	authService.$inject = ["$q", "$ionicHistory", "$cordovaOauth", "$twitterApi", "$timeout", "$state", "fbAuth", "fbDataRef", "getClientIp", "fbUtilities", "loaderService", "userDataLocalStorageKey", "Codes", "NativeDeviceStorage"]; // "geoService", 

	/* @ngInject */
	function authService($q, $ionicHistory, $cordovaOauth, $twitterApi, $timeout, $state, fbAuth, fbDataRef, getClientIp, fbUtilities, loaderService, userDataLocalStorageKey, Codes, NativeDeviceStorage) { // geoService

		// globals
		var _timeStamp = fbTimeStamp();
		var _defaultCategory = { 0: { "name": "Requester (Default)", "id": "-KHRNZiRmK2uFcYvnZO6" } };

		var self = this;
		self.AuthData = {};

		/**
		 * Init the global variable AuthData
		 */
		onAuth().then(
			function(AuthData) {
				self.AuthData = AuthData;
			}
		);

		var service = {
			onAuth: onAuth,
			unAuth: unAuth,
			getAuthState: getAuthState,
			fbTimeStamp: fbTimeStamp,
			emailRegExFilter: emailRegExFilter,
			logout: logout,
			changePassword: changePassword,
			resetPassword: resetPassword,
			socialLogin: socialLogin,
			setUserData: setUserData,
			createOrUpdateUser: createOrUpdateUser,
			createOrUpdateUserProfile: createOrUpdateUserProfile,
			createOrUpdateUserMedia: createOrUpdateUserMedia,
			redirectUser: redirectUser,
			loginPassword: loginPassword,
			getUserDataFromLocalStorage: getUserDataFromLocalStorage,
			googleUserObject: googleUserObject,
			googleUserProfileObject: googleUserProfileObject,
			twitterUserObject: twitterUserObject,
			twitterUserProfileObject: twitterUserProfileObject,
			getTwitterEmail: getTwitterEmail,
			facebookUserObject: facebookUserObject,
			facebookUserProfileObject: facebookUserProfileObject,
			passwordUserObject: passwordUserObject,
			passwordUserProfileObject: passwordUserProfileObject
		};

		return service;

		////////////

		/**
		 * unAuthenticate the user
		 * independent of method (password, twitter, etc.)
		 */
		function unAuth() {
			var ref = fbDataRef.root;
			self.AuthData = {};
			return ref.unauth();
		};

		/**
		 * Monitor the current authentication state
		 * returns on success:  AuthData
		 * returns on fail:     AUTH_LOGGED_OUT
		 */
		function onAuth() {
			var qAuthState = $q.defer();

			function AuthDataCallback(AuthData) {
				if (AuthData) {
					self.AuthData = AuthData; //gv
					qAuthState.resolve(AuthData);
					console.log("logged in");
				} else {
					qAuthState.reject("AUTH_LOGGED_OUT");
					console.log("logged out");
				}
			};

			var ref = fbDataRef.root;
			ref.onAuth(AuthDataCallback);
			return qAuthState.promise;
		}

		function getAuthState() {
			return onAuth();
		};

		function fbTimeStamp() {
			return Firebase.ServerValue.TIMESTAMP;
		}

		function emailRegExFilter() {
			return /^[0-9a-zA-Z]+([0-9a-zA-Z]*[-._+])*[0-9a-zA-Z]+@[0-9a-zA-Z]+([-.][0-9a-zA-Z]+)*([0-9a-zA-Z]*[.])[a-zA-Z]{2,6}$/;
		}

		function logout() {
			fbAuth.$unauth();
			NativeDeviceStorage.remove();
			redirectUser();
		}

		/**
		 * Change Password or Reset Password
		 */
		function changePassword(userEmail, oldPassword, newPassword) {
			var qChange = $q.defer();
			var ref = fbDataRef.root;
			ref.changePassword({
				email: userEmail,
				oldPassword: oldPassword,
				newPassword: newPassword
			}, function(error) {
				if (error === null) {
					qChange.resolve("CHANGE_PASSWORD_SUCCESS");
				} else {
					qChange.reject(error);
				}
			});
			return qChange.promise;
		};

		function resetPassword(userEmail) {
			var qConfirm = $q.defer();
			var ref = fbDataRef.root;
			ref.resetPassword({
					email: userEmail
				},
				function(error) {
					if (error) {
						qConfirm.reject(error);
					} else {
						qConfirm.resolve("RESET_PASSWORD_SUCCESS");
					}
				});
			return qConfirm.promise;
		};

		function socialLogin(provider, options) {
			loaderService.showLoader("Please wait...", "");
			// geoService.getCurrentPosition(function(position) {
				// console.log('POSITION', position);
				// if (position.coords.latitude) {

					var ipAddress = "";
					getClientIp.async().then(function(data) {
						var response = data;
						ipAddress = response.data.ip;
						//console.debug("authService getClientIp", response.data.ip);
					});

					var lat = 0; //position.coords.latitude;
					var long = 0; //position.coords.longitude;

					// prefer pop-ups, so we don't navigate away from the page
					return fbAuth.$authWithOAuthPopup(provider, options).then(function(authData) {
						// user authenticated with Firebase, create "users" data profile.
						setUserData(provider, authData, _timeStamp, _timeStamp, lat, long, ipAddress);
					}).catch(function(error) {
						// fall-back to browser redirects, and pick up the session
						// automatically when we come back to the origin page
						if (error.code === "TRANSPORT_UNAVAILABLE") {
							return fbAuth.$authWithOAuthRedirect(provider, options).then(function(authData) {
								// user authenticated with Firebase, create "users" data profile.
								setUserData(provider, authData, _timeStamp, _timeStamp, lat, long, ipAddress);
							}).then(function() {
								// Never called because of page redirectioni
							}).catch(function(error) {
								Codes.handleError(error);
							});
						} else {
							Codes.handleError(error);
						}
					});
				// }
			// });
		}

		function setUserData(provider, authData, updatedAt, lastLoggedInAt, lat, long, ipAddress) {

			// TODO - Make sure nothing is created in firebase if emails match any existing account.
			//	Another possibility would be to connect the accounts as one entity.
			//	Firebase already makes sure that there are no duplicate records in the "Auth" section of the console.

			// OR just upgrade to v3 of the Firebase API

			var emailAddress;
			switch (provider) {
			case "google":
				//emailAddress = authData.google.email;
				createOrUpdateUser(googleUserObject(authData), authData);
				createOrUpdateUserProfile(googleUserProfileObject(authData, lat, long, ipAddress), authData);
				break;
			case "twitter":
				emailAddress = getTwitterEmail(authData);
				createOrUpdateUser(twitterUserObject(authData), authData);
				createOrUpdateUserProfile(twitterUserProfileObject(authData, lat, long, ipAddress, emailAddress), authData);
				break;
			case "facebook":
				//emailAddress = authData.facebook.email;
				createOrUpdateUser(facebookUserObject(authData), authData);
				createOrUpdateUserProfile(facebookUserProfileObject(authData, lat, long, ipAddress), authData);
				break;
			}
		}

		function getTwitterEmail(authData) {
			var twitterKey = "STORAGE.TWITTER.KEY";
			var clientId = "JRh0oMc4aKSRJIpQK2me3JMEP";
			var clientSecret = "eoZAMZxRStQAUJcDM7puFEtI1e1kGeTjHFIY47Oe4wcZ15A08A";

			var twitterOAuthToken = JSON.parse(window.localStorage.getItem(twitterKey));
			if (twitterOAuthToken === "" || twitterOAuthToken === null) {
				var twitterOAuthTokenObj = {
					oauth_token: authData.twitter.accessToken,
					oauth_token_secret: authData.twitter.accessTokenSecret,
					user_id: authData.twitter.id,
					screen_name: authData.twitter.username,
					x_auth_expires: "0"
				};
				//console.debug("twitterOAuthTokenObj", twitterOAuthTokenObj);
				$twitterApi.configure(clientId, clientSecret, twitterOAuthTokenObj);
				window.localStorage.setItem(twitterKey, JSON.stringify(twitterOAuthTokenObj));
			} else {
				//console.debug("twitterOAuthTokenObj", twitterOAuthToken);
				$twitterApi.configure(clientId, clientSecret, twitterOAuthToken);
			}

			$twitterApi.getRequest("https://api.twitter.com/1.1/account/verify_credentials.json",
			{ include_entities: false, skip_status: true, include_email: true }).then(function(resp) {
				return resp.email;
			}, function(error) {
				console.log("Twitter verify_credentials Error:", error);
				return "";
			});
		}

		function createOrUpdateUser(userObject, authData) {
			var ref = fbUtilities.ref("users", authData.authGroup);
			ref.once("value", function(snapshot) {
				var existsAuthGroup = (snapshot.val() !== null);
				if (!existsAuthGroup) {
					fbUtilities.handler(function(cb) {
						authData = ref.set(userObject, cb);
					});
				}

			});
		}

		function createOrUpdateUserProfile(userObject, userData) {
			var ref = fbUtilities.ref("userProfiles", userData.authGroup);
			ref.once("value", function(snapshot) {
				var snap = snapshot.val();
				NativeDeviceStorage.set(snap);
				var existsAuthGroup = (snap !== null);
				if (!existsAuthGroup) {
					fbUtilities.handler(function(cb) {
						userData = ref.set(userObject, cb);
						NativeDeviceStorage.set(userObject);
						redirectUser();
					});
				} else {
					redirectUser();
				}
			});
		}

		function createOrUpdateUserMedia(imgResponse) {
			var userData = getUserDataFromLocalStorage();
			var ref = fbUtilities.ref("userMedia", userData.authGroup);
			ref.once("value", function(snapshot) {
				var exists = (snapshot.val() !== null);
				if (!exists) {
					fbUtilities.handler(function(cb) {
						userData = ref.set(imgResponse, cb);
					});
				}
			});
			// Now lets update the user profile
			var refProfile = fbDataRef.userProfiles.child(userData.authGroup);
			refProfile.update({ picture: imgResponse.secure_url });
		}

		function redirectUser(state) {
			if (!state) state = "app.landing";
			$ionicHistory.nextViewOptions({ disableBack: true, historyRoot: true });
			$ionicHistory.clearCache().then(function() {
				loaderService.hideLoader();
				$timeout(function() {
					$state.go(state, { reload: true });
				});
			});
		}

		function loginPassword(user, options) {
			return fbAuth.$authWithPassword(user, options);
		}

		function getUserDataFromLocalStorage() {
			var user = localStorage.getItem(userDataLocalStorageKey);
			if (user) {
				return JSON.parse(user);
			} else {
				return "";
			}
		}

		function googleUserObject(user) {
			return {
				authGroup: user.authGroup,
				key: user.uid,
				userId: user.authGroup,
				provider: user.provider,
				token: user.token,
				expires: user.expires,
				googleId: user.google.id,
				createdAt: _timeStamp
			};
		}

		function googleUserProfileObject(user, lat, long, ipAddress) {
			return {
				userId: user.authGroup,
				expires: user.expires,
				google: user.google,
				googleId: user.google.id,
				accessToken: user.google.accessToken,
				name: user.google.displayName,
				displayName: user.displayName ? user.displayName : user.google.displayName,
				email: user.google.email,
				picture: user.google.profileImageURL,
				createdAt: _timeStamp,
				loginLat: lat,
				loginLong: long,
				ipAddress: ipAddress,
				categories: _defaultCategory
			};
		}

		function twitterUserObject(user) {
			return {
				authGroup: user.authGroup,
				key: user.uid,
				userId: user.authGroup,
				provider: user.provider,
				token: user.token,
				accessToken: user.twitter.accessToken,
				accessTokenSecret: user.twitter.accessTokenSecret,
				createdAt: _timeStamp
			};
		}

		function twitterUserProfileObject(user, lat, long, ipAddress, email) {
			return {
				userId: user.authGroup,
				provider: user.provider,
				token: user.token,
				expires: user.expires,
				twitter: user.twitter,
				twitterId: user.twitter.id,
				name: user.twitter.displayName,
				displayName: user.displayName ? user.displayName : user.twitter.username,
				email: email,
				picture: user.twitter.profileImageURL.replace("_normal.", "."),
				createdAt: _timeStamp,
				loginLat: lat,
				loginLong: long,
				ipAddress: ipAddress,
				categories: _defaultCategory
			};
		}

		function facebookUserObject(user) {
			return {
				authGroup: user.authGroup,
				key: user.uid,
				userId: user.authGroup,
				provider: user.provider,
				token: user.token,
				expires: user.expires,
				createdAt: _timeStamp
			};
		}

		function facebookUserProfileObject(user, lat, long, ipAddress) {
			return {
				userId: user.authGroup,
				provider: user.provider,
				token: user.token,
				expires: user.expires,
				facebook: user.facebook,
				facebookId: user.facebook.id,
				accessToken: user.facebook.accessToken,
				name: user.facebook.displayName,
				displayName: user.displayName ? user.displayName : user.facebook.displayName,
				email: user.facebook.email,
				picture: user.facebook.profileImageURL,
				createdAt: _timeStamp,
				loginLat: lat,
				loginLong: long,
				ipAddress: ipAddress,
				categories: _defaultCategory
			};
		}

		function passwordUserObject(user) {
			return {
				authGroup: user.authGroup,
				key: user.uid,
				userId: user.authGroup,
				provider: user.provider,
				token: user.token,
				authData: user.auth,
				expires: user.expires,
				isTemporaryPassword: user.password.isTemporaryPassword,
				createdAt: _timeStamp
			};
		}

		function passwordUserProfileObject(user, displayName, lat, long, ipAddress) {
			return {
				userId: user.authGroup,
				expires: user.expires,
				name: displayName ? displayName : "",
				displayName: displayName ? displayName : "",
				email: user.password.email,
				picture: user.password.profileImageURL.replace("?d=retro", "?d=mm&s=800"),
				createdAt: _timeStamp,
				loginLat: lat,
				loginLong: long,
				ipAddress: ipAddress,
				categories: _defaultCategory
			};
		}
	}
})();