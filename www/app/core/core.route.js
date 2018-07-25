(function() {
	"use strict";

	angular
		.module("app.core")
		.run(appRun);

	function appRun($firebaseArray, $ImageCacheFactory, cordovaNetworkInformation, fbDataRef, routerHelper) {

		// pre-cache all remote images
		preCacheRemoteImages();
		function preCacheRemoteImages() {
			var refRequests = fbDataRef.requestAttachment;
			var attachments = $firebaseArray(refRequests).$loaded();
			attachments.then(function (data) {

				//Build the list of images to preload
				var images = [];
				for (var i = 0; i < data.length; i++) {
					images.push(data[i].secure_url);
				}

				$ImageCacheFactory.Cache(images);
			});

			var refUser = fbDataRef.userProfiles;
			var profileImages = $firebaseArray(refUser).$loaded();
			profileImages.then(function (data) {

				//Build the list of images to preload
				var images = [];
				for (var i = 0; i < data.length; i++) {
					images.push(data[i].picture);
				}

				$ImageCacheFactory.Cache(images);
			});
		}

		document.addEventListener("deviceready", onDeviceReady, false);
		function onDeviceReady() {

			// Device
			var version = window.device.version;
			var model = window.device.model;
			var platform = window.device.platform;
			var uuid = window.device.uuid;
			var manufacturer = window.device.manufacturer;
			var serial = window.device.serial;

			// Connection
			var currentConnection = cordovaNetworkInformation.checkConnection();
		}

		var otherwise = "app.landing";
		routerHelper.configureStates(getStates(), otherwise);
	}

	function getStates() {
		return [
			{
				state: "app",
				abstract: true,
				cache: false,
				config: {
					templateUrl: "app/layout/menu.html",
					controller: "AppController",
					title: "app"
				}
			}
		];
	}
})();