(function() {
	"use strict";

	angular
		.module("app.help")
		.run(appRun);

	appRun.$inject = ["$http", "routerHelper"];

	/* @ngInject */
	function appRun($http, routerHelper) {
		routerHelper.configureStates(getStates());
	}

	function getStates() {
		return [
			{
				state: "app.help",
				config: {
					url: "/help",
					views: {
						'viewName': {
							templateUrl: "app/help/help.html",
							controller: "HelpController",
							controllerAs: "vm",
							title: "Help Center"
						}
					}
				}
			}
		];
	}
})();