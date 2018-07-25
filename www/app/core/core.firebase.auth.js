(function () {
	"use strict";

	angular
		.module("app.core")
		.factory("fbAuth", fbAuth);

	fbAuth.$inject = ["$firebaseAuth", "fbUtilities"];

	/* @ngInject */
	function fbAuth($firebaseAuth, fbUtilities) {
		return $firebaseAuth(fbUtilities.ref());
	}

})();