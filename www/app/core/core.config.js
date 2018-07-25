(function() {
	"use strict";

	var core = angular.module("app.core");

	// Application configuration values
	var config = {
		appErrorPrefix: "[Request It! App Error] ",
		appTitle: "Request It!"
	};

	core.value("config", config);
	core.config(configure);

	configure.$inject = [
		"$logProvider",
		"$httpProvider",
		"appVersion",
		"debugMode",
		"routerHelperProvider",
		"exceptionHandlerProvider",
		"$ionicConfigProvider",
		"$ionicNativeTransitionsProvider",
		"$mdThemingProvider",
		"$mdIconProvider",
		"$compileProvider"
	];

	/* @ngInject */
	function configure(
		$logProvider,
		$httpProvider,
		appVersion,
		debugMode,
		routerHelperProvider,
		exceptionHandlerProvider,
		$ionicConfigProvider,
		$ionicNativeTransitionsProvider,
		$mdThemingProvider,
		$mdIconProvider,
		$compileProvider) {

		$httpProvider.useApplyAsync(true);

		// Kill Ionic Cache Globally
		$ionicConfigProvider.views.maxCache(0);

		//Firebase.enableLogging(false, false);

		// During development, you may want to set debugInfoEnabled to true. This is required for tools like
		// Protractor, Batarang and ng-inspector to work correctly. However do not check in this change.
		// This flag must be set to false in production for a significant performance boost.
		$compileProvider.debugInfoEnabled(debugMode);

		// Whitelist Plugins
		$compileProvider.imgSrcSanitizationWhitelist(/^\s*(https?|ftp|file|tel|blob|content|ms-appx|x-wmapp0):|data:image\/|img\//);
		$compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|file|ghttps?|ms-appx|x-wmapp0):/);

		// turn debugging off/on (no info or warn)
		if ($logProvider.debugEnabled) {
			$logProvider.debugEnabled(debugMode);
		}

		exceptionHandlerProvider.configure(config.appErrorPrefix);
		routerHelperProvider.configure({ docTitle: config.appTitle + ": " });

		// Setup a basic theme for angular material
		$mdThemingProvider.theme("default")
			.primaryPalette("blue", {
				'default': "800"
			})
			.accentPalette("amber", {
				'default': "700"
			});

		$mdIconProvider.fontSet("zmdi", "Material-Design-Iconic-Font");

		$ionicNativeTransitionsProvider.setDefaultOptions({
			duration: 200, // in milliseconds (ms), default 400,
			slowdownfactor: 1, // overlap views (higher number is more) or no overlap (1), default 4
			iosdelay: -1, // ms to wait for the iOS webview to update before animation kicks in, default -1
			androiddelay: -1, // same as above but for Android, default -1
			winphonedelay: -1, // same as above but for Windows Phone, default -1,
			fixedPixelsTop: 0, // the number of pixels of your fixed header, default 0 (iOS and Android)
			fixedPixelsBottom: 0, // the number of pixels of your fixed footer (f.i. a tab bar), default 0 (iOS and Android)
			triggerTransitionEvent: "$ionicView.afterEnter", // internal ionic-native-transitions option
			backInOppositeDirection: false // Takes over default back transition and state back transition to use the opposite direction transition to go back
		});

		// remove back button previous title text
		// use unicode em space characters to increase touch target area size of back button
		$ionicConfigProvider.backButton.previousTitleText(false).text("");

		// Disable Ionic Animation
		$ionicConfigProvider.views.transition("none");

		//var isIOS = ionic.Platform.isIOS();

		//Turn on JS Scrolling for iOS due to keyboard issues
		//if (isIOS)
		//	$ionicConfigProvider.scrolling.jsScrolling(true);

		$ionicNativeTransitionsProvider.setDefaultTransition({
			type: "slide",
			direction: "left"
		});

		$ionicNativeTransitionsProvider.setDefaultBackTransition({
			type: "slide",
			direction: "right"
		});

	}

})();