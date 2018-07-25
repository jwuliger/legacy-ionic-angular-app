(function () {
	"use strict";

	angular
		.module("app.feedback")
		.run(appRun);

	appRun.$inject = ["routerHelper"];

	/* @ngInject */
	function appRun(routerHelper) {
		routerHelper.configureStates(getStates());
	}

	function getStates() {
		return [
			{
				state: "app.feedback",
				config: {
					url: "/feedback",
					views: {
						'viewName': {
							templateUrl: "app/feedback/feedback.html",
							controller: "FeedbackController",
							controllerAs: "vm",
							title: "Your Feedback"
						}
					}
				}
			}
		];
	}
})();