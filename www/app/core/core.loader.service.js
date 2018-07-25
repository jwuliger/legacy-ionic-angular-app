(function() {
	"use strict";

	angular
		.module("app.core")
		.factory("loaderService", loaderService);

	loaderService.$inject = ["$ionicLoading"];

	/* @ngInject */
	function loaderService($ionicLoading) {

		// Default values
		this.loadingMessage = "Loading...";

		var service = {
			showLoader: showLoader,
			hideLoader: hideLoader
		};

		return service;

		////////////

		function showLoader(loadingMessage) {
			$ionicLoading.show({
				template: "<ion-spinner icon='android'></ion-spinner><br />" + loadingMessage,
				animation: "fade-in",
				showBackdrop: true
			});
		};

		function hideLoader() {
			$ionicLoading.hide();
		}

	}

})();