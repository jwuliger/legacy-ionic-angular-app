(function() {
	"use strict";

	angular
		.module("app.info")
		.controller("InfoController", InfoController);

	InfoController.$inject = ["$scope", "$mdSidenav", "cordovaNetworkInformation", "getClientIp", "appVersion"];

	function InfoController($scope, $mdSidenav, cordovaNetworkInformation, getClientIp, appVersion) {
		var vm = this;

		vm.localAppVersion = appVersion;

		//$scope.$on("onOnlineUser", function() {
		//	$scope.$apply(function() {
		//		$scope.totalViewers = PresenceService.getOnlineUserCount();
		//	});
		//});

		getClientIp.async().then(function(data) {
			vm.response = data;
			vm.ipAddress = vm.response.data.ip;
			//console.debug("InfoController getClientIp", vm.response.data.ip);
		});

		document.addEventListener("deviceready", onDeviceReady, false);

		function onDeviceReady() {

			// Device

			vm.cordova = window.device.cordova;
			vm.version = window.device.version;
			vm.model = window.device.model;
			vm.platform = window.device.platform;
			vm.uuid = window.device.uuid;
			vm.manufacturer = window.device.manufacturer;
			vm.serial = window.device.serial;

			// Connection
			vm.CurrentConnection = cordovaNetworkInformation.checkConnection();
		}
	}

})();