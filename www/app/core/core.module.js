(function() {
	"use strict";

	angular
		.module("app.core", [
			"blocks.exception",
			"blocks.logger",
			"blocks.router",
			"ionic-native-transitions",
			"angular.filter",
			"ui.router",
			"ngAnimate",
			"ngMessages",
			"ngAria",
			"ngMaterial",
			"ngTwitter",
			"toastr",
			"firebase",
			"underscore"
		]);
})();