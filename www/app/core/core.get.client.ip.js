(function() {
	"use strict";

	angular
		.module("app.core")
		.factory("getClientIp", getClientIp);

	getClientIp.$inject = ["$http"];

	/* @ngInject */
	function getClientIp($http) {
		return {
			async: function () {
				return $http.get("https://api.ipify.org?format=json");
			}
		};
	}
})();