(function() {
	"use strict";

	angular
		.module("app.request")
		.run(appRun);

	appRun.$inject = ["$rootScope", "$state", "fbAuth", "routerHelper"];

	/* @ngInject */
	function appRun($rootScope, $state, fbAuth, routerHelper) {
		routerHelper.configureStates(getStates());
	}

	function getStates() {
		return [
			{
				state: "app.request",
				config: {
					url: "/request",
					views: {
						'viewName': {
							templateUrl: "app/requests/requests.html",
							controller: "RequestsController",
							controllerAs: "vm",
							title: "New Request"
						}
					},
					resolve: {
						'userProfile': function (NativeDeviceStorage) {
							return NativeDeviceStorage.get();
						}
					}
				}
			},
			{
				state: "app.requests",
				config: {
					url: "/browse-requests/:areaName",
					views: {
						'viewName': {
							templateUrl: "app/requests/browse/requests.browse.html",
							controller: "BrowseRequestsController",
							controllerAs: "vm",
							title: "Browse Requests"
						}
					}
					,resolve: {
						filterModal: function ($ionicModal, $rootScope) {
							return $ionicModal.fromTemplateUrl("app/requests/browse/filter.html", {
								scope: $rootScope,
								animation: "slide-in-up"
							});
						}
					}
				}
			}
		];
	}
})();