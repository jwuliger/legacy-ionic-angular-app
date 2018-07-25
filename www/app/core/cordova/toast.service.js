(function() {
	"use strict";

	angular
		.module("app.core")
		.factory("cordovaToast", cordovaToast);

	cordovaToast.$inject = [];

	/* @ngInject */
	function cordovaToast() {
		var service = {
			show: show
		};

		return service;

		/////////////////////

		function show(message, duration, position) {
			document.addEventListener("deviceready", function() {

				var isAndroid = ionic.Platform.isAndroid();

				window.plugins.toast.showWithOptions(
					{
						message: message,
						duration: duration, //Options : 'short', 'long'
						position: position, //Options : 'top', 'center', 'bottom'
						addPixelsY: -50,
						styling: {
							opacity: isAndroid ? 0.7 : 0.9, // 0.0 (transparent) to 1.0 (opaque). Default 0.8
							backgroundColor: "#333333", // make sure you use #RRGGBB. Default #333333
							textColor: "#FFFFFF", // Ditto. Default #FFFFFF
							textSize: 16, // Default is approx. 13.
							cornerRadius: isAndroid ? 100 : 20, // minimum is 0 (square). iOS default 20, Android default 100
							horizontalPadding: isAndroid ? 50 : 16, // iOS default 16, Android default 50
							verticalPadding: isAndroid ? 30 : 12 // iOS default 12, Android default 30
						}
					},
					// implement the success callback
					function(result) {
						if (result && result.event) {
							//console.log("The toast was tapped");
							//console.log("Event: " + result.event); // will be defined, with a value of "touch" when it was tapped by the user
							//console.log("Message: " + result.message); // will be equal to the message you passed in
							//console.log("data.foo: " + result.data.foo); // .. retrieve passed in data here
						} else {
							//console.log("The toast has been shown");
						}
					}
				);
			});
		}
	}
}());