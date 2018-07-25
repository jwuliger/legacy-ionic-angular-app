(function() {
	"use strict";

	angular
		.module("app.landing")
		.run(appRun);

	appRun.$inject = ["routerHelper"];

	/* @ngInject */
	function appRun(routerHelper) {
		routerHelper.configureStates(getStates());
	}

	function getStates() {
		return [
			{
				state: "app.landing",
				config: {
					url: "/",
					views: {
						"viewName": {
							templateUrl: "app/landing/landing.html",
							controller: "LandingController",
							controllerAs: "vm",
							title: "Home"
						}
					}
				}
			}
		];
	}
})();