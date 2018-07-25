(function() {
	"use strict";

	angular
		.module("app.feedback")
		.controller("FeedbackController", FeedbackController);

	FeedbackController.$inject = ["$scope", "cordovaToast", "authService", "FeedbackFactory"];

	function FeedbackController($scope, cordovaToast, authService, FeedbackFactory) {
		var vm = this;

		activate();

		function activate() {
			vm.submit = submit;
		}

		var formCallbacks = {
			success: function() {
				vm.messageData = {};
				vm.feedbackForm.$setUntouched();
				vm.feedbackForm.$setPristine();
				cordovaToast.show("Message sent!", "long", "bottom");
				authService.redirectUser("app.landing");

			},
			error: function(error) {
				console.debug("error", error);
				cordovaToast.show("There was a problem subitting the form.", "long", "bottom");
			}
		};

		///////////////////////////

		function submit() {
			var data = angular.copy(vm.messageData);
			var msg = new FeedbackFactory(data, vm.feedbackForm.$valid);
			msg.submit().then(function() {
				formCallbacks.success();
			}).catch(function(error) {
				console.debug(error);
				formCallbacks.error();
			});
		}

	}

})();