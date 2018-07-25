(function() {
	"use strict";

	angular
		.module("app.components")
		.component("searchToolBar", {
			isolate: false,
			replace: true,
			bindings: {
				searchHeaderTitle: "@"
			},
			controller: ControllerFunction,
			templateUrl: "app/components/requests/search.bar.html"
		})
		.controller("ControllerFunction", ControllerFunction);

	// ----- ControllerFunction -----
	ControllerFunction.$inject = ["$scope"];

	/* @ngInject */
	function ControllerFunction($scope) {
		
	}

})();