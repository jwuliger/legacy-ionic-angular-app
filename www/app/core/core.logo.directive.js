(function() {
	"use strict";

	angular
		.module("app.core")
		.directive("requestItLogo", requestItLogo);

	requestItLogo.$inject = [];

	function requestItLogo() {
		// Usage:
		//     <request-it-logo></request-it-logo>
		// Creates:
		//		A DRY way to include the logo image tag in templates.
		// 
		var directive = {
			template: '<img src="images/request-it-logo.png" alt="" class="md-card-image" />',
			restrict: "E",
			replace: true
		};
		return directive;
	}

})();