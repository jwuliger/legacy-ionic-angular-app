(function() {
	"use strict";

	angular
		.module("app.core")
		.factory("authCheck", authCheck);

	authCheck.$inject = ["$state", "fbAuth","loginStateName", "NativeDeviceStorage"];

	/* @ngInject */
	function authCheck($state, fbAuth, loginStateName, NativeDeviceStorage) {

		return fbAuth.$onAuth(check);;

		function check(user) {
			if (!user) {
				NativeDeviceStorage.remove();
				$state.go(loginStateName, { reload: true });
			}
		}
	}

})();