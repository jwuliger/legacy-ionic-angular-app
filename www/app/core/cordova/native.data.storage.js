(function () {
	"use strict";

	angular
		.module("app.core")
		.service("NativeDeviceStorage", NativeDeviceStorage);

	NativeDeviceStorage.$inject = ["$ionicPlatform", "$q", "$cordovaNativeStorage", "userProfileDataLocalStorageKey", "logger"];

	/* @ngInject */
	function NativeDeviceStorage($ionicPlatform, $q, $cordovaNativeStorage, userProfileDataLocalStorageKey, logger) {
		var service = {
			get: get,
			set: set,
			remove: remove
		};

		return service;

		/////////////////////

		function get() {

			var q = $q.defer();

			$ionicPlatform.ready(function () {
				q.resolve($cordovaNativeStorage.getItem(userProfileDataLocalStorageKey));
			});
			return q.promise;
		}

		function set(data) {
			$ionicPlatform.ready(function () {
				$cordovaNativeStorage.setItem(userProfileDataLocalStorageKey, data).then(function (returnData) {
					//logger.log("The set callback value", returnData);
					return returnData;
				}, function (error) {
					//logger.log("The set callback error", error);
					return false;
				});
			});
		}

		function remove() {
			$ionicPlatform.ready(function () {
				$cordovaNativeStorage.remove(userProfileDataLocalStorageKey).then(function (value) {
					//logger.log("The remove callback value", value);
					return true;
				}, function (error) {
					//logger.log("The remove callback error", error);
					return false;
				});
			});
		}

	}
}());