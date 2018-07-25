(function () {
	"use strict";

	angular
		.module("app.info")
		.run(appRun);

	appRun.$inject = ["routerHelper"];

	/* @ngInject */
	function appRun(routerHelper) {
		routerHelper.configureStates(getStates());
	}

	function getStates() {
		return [
			{
				state: "app.info",
				config: {
					url: "/info",
					views: {
						'viewName': {
							templateUrl: "app/info/info.html",
							controller: "InfoController",
							controllerAs: "vm",
							title: "Info"
						}
					}
				}
			}
		];
	}
})();