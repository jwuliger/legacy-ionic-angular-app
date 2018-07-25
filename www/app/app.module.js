(function () {
	"use strict";

	angular
		.module("app", [
			"ionic",
			"ngSanitize",
			"ngCordova",
			"ngCordovaOauth",
			"ngCordova.plugins.nativeStorage",
			"app.core",
			"app.admin",
			"app.user",
			"app.chat",
			"app.request",
			"app.requests",
			"app.about",
			"app.help",
			"app.feedback",
			"app.landing",
			"app.info",
			"app.layout",
			"app.views",
			"app.components"
		])
		.run(startApp);

	startApp.$inject = [
		"$ImageCacheFactory",
		"$ionicPlatform",
		"$cordovaStatusbar"
	];

	/* @ngInject */
	function startApp(
		$ImageCacheFactory,
		$ionicPlatform,
		$cordovaStatusbar
	) {
		$ionicPlatform.ready(function () {

			$ImageCacheFactory.Cache([
				"images/bg.jpg",
				"images/menu-bg-001.jpg",
				"images/request-it-logo.png"
			]);

			// Hide the accessory bar by default (remove this to show the accessory bar above the keyboard for form inputs)
			if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
				cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
				cordova.plugins.Keyboard.disableScroll(true);
			}

			if (window.StatusBar) {
				$cordovaStatusbar.overlaysWebView(true);
				$cordovaStatusbar.styleHex("#183D50");
				$cordovaStatusbar.show();
			}

			document.addEventListener("resume", function () {
				Firebase.goOnline();
				console.info("The App Has Resumed - Firebase Has Come Online");
			}, false);

			document.addEventListener("pause", function () {
				Firebase.goOffline();
				console.info("The App Has Paused - Firebase Has Gone Offline");
			}, false);

			document.addEventListener("deviceready", onDeviceReady, false);
			function onDeviceReady() {

				window.open = cordova.InAppBrowser.open;

				$ionicPlatform.registerBackButtonAction(function (event) {
					function onConfirm(buttonIndex) {
						if (buttonIndex === 0 || buttonIndex === 1) {
							// Do nothing
						} else {
							ionic.Platform.exitApp();
						}
					}
					if (true) {
						navigator.notification.confirm(
							"Are you sure you want to exit Request It?", // message
							onConfirm, // callback to invoke with index of button pressed
							"App Warning", // title
							["No", "Yes"] // buttonLabels
						);
					}
				}, 100);
			}
		});
	};
})();