(function () {
	"use strict";

	angular
		.module("app.about")
		.run(appRun);

	appRun.$inject = ["routerHelper"];

	/* @ngInject */
	function appRun(routerHelper) {
		routerHelper.configureStates(getStates());
	}

	function getStates() {
		return [
			{
				state: "app.about",
				config: {
					url: "/about",
					views: {
						'viewName': {
							templateUrl: "app/about/about.html",
							controller: "AboutController",
							controllerAs: "vm",
							title: "About Us"
						}
					}
				}
			},
			{
				state: "app.learn",
				config: {
					url: "/learn",
					views: {
						'viewName': {
							templateUrl: "app/about/learn-more.html",
							controller: "AboutController",
							controllerAs: "vm",
							title: "Learn More"
						}
					}
				}
			}
		];
	}
})();