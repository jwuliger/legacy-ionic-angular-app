// (function() {
// 	"use strict";

// 	angular
// 		.module("app.core")
// 		.factory("geoService", geoService);

// 	geoService.$inject = ["$rootScope", "$timeout", "logger"];

// 	// Mock the API
// 	var position = {
// 		"coords": {
// 			"latitude": 0,
// 			"longitude": 0
// 		}
// 	}

// 	// function getCurrentPosition() {
// 	// 	return position;
// 	// }

// 	/* @ngInject */
// 	function geoService($rootScope, $timeout, logger) {

// 		// https://cordova.apache.org/docs/en/latest/reference/cordova-plugin-geolocation/

// 		return {
// 			// position

// 			function(position) {
// 				if (position)
// 					$rootScope.$apply(successCallback(position));
// 			},
// 			function(error) {
// 				logger.log("geoService error", error);
// 			}
// 		}; 
// 		// {

// 		// 	/**
// 		// 	 * Check the geolocation plugin availability.
// 		// 	 * @returns {boolean}
// 		// 	*/
// 		// 	checkGeolocationAvailability: function() {
// 		// 		if (!navigator.geolocation) {
// 		// 			logger.log("Geolocation API is not available.");
// 		// 			return false;
// 		// 		} else {
// 		// 			return true;
// 		// 		}
// 		// 	},

// 		// 	/**
// 		// 	 * Returns the device's current position to the geolocationSuccess callback with a Position object as the parameter.
// 		// 	 */
// 		// 	getCurrentPosition: function(successCallback, errorCallback) {



// 		// 		$timeout(function() {
// 		// 			// console.log('successCallback(position)', successCallback(position) );
// 		// 			$rootScope.$apply(position);
// 		// 		  });

// 		// 		// Checking API availability
// 		// 		// if (!this.checkGeolocationAvailability()) {
// 		// 		// 	return;
// 		// 		// }

// 		// 		// // API call
// 		// 		// navigator.geolocation.getCurrentPosition(
// 		// 		// 	function(position) {
// 		// 		// 		if (position)
// 		// 		// 			$rootScope.$apply(successCallback(position));
// 		// 		// 	},
// 		// 		// 	function(error) {
// 		// 		// 		logger.log("geoService error", error);
// 		// 		// 	},
// 		// 		// 	{ maximumAge: 3000, timeout: 5000, enableHighAccuracy: true }
// 		// 		// );
// 		// 	}
// 		// };


// 	}

// })();