(function () {
	"use strict";

	angular
		.module("app.core")
		.constant("firebaseUrl", "https://requestit.firebaseio.com")
		.constant("firebaseAltUrl", "https://requestit-alt.firebaseio.com")
		.constant("userDataLocalStorageKey", "firebase:session::requestit")
		.constant("userProfileDataLocalStorageKey", "firebase:session::requestit::userprofile")
		.constant("loginStateName", "app.login")
		.constant("appVersion", "0.2.7")
		.constant("debugMode", false);
})();