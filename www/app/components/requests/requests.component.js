(function() {

	"use strict";

	angular.module("app.components")
		.component("requestList", {
			templateUrl: "app/components/requests/requests.html",
			controller: ControllerFunction,
			isolate: false,
			bindings: {
				requests: "=",
				searchHeaderTitle: "@",
				area: "@",
				subArea: "@",
				userId: "@"
			}
		})
		.controller("ControllerFunction", ControllerFunction);

	// ----- ControllerFunction -----
	ControllerFunction.$inject = ["$window", "$scope", "$state", "$mdDialog", "requestService", "authService", "supporterService", "openModalService", "fbDataRef", "userDataLocalStorageKey"];

	/* @ngInject */
	function ControllerFunction($window, $scope, $state, $mdDialog, requestService, authService, supporterService, openModalService, fbDataRef, userDataLocalStorageKey) {
		var $ctrl = this;

		var _userId, _userData = $window.localStorage.getItem(userDataLocalStorageKey);
		if (_userData) {
			_userData = JSON.parse(_userData);
			_userId = _userData.authGroup;
		}

		// Init Methods //
		$ctrl.showImage = showImage;
		$ctrl.acceptRequest = acceptRequest;
		$ctrl.editRequest = editRequest;
		$ctrl.archiveRequest = archiveRequest;
		$ctrl.ignoreRequestUntil = ignoreRequestUntil;
		$ctrl.deleteRequestForever = deleteRequestForever;
		$ctrl.openThanksConfirm = openThanksConfirm;
		$ctrl.openChatConfirm = openChatConfirm;
		$ctrl.reportRequest = reportRequest;
		$ctrl.upVote = upVote;

		var originatorEv;
		$ctrl.openMenu = function($mdOpenMenu, ev) {
			originatorEv = ev;
			$mdOpenMenu(ev);
		};

		// moment js
		$ctrl.moment = window.moment;

		function showImage(imgUri, ev) {
			var parentEl = angular.element(document.body);
			$scope.imgUri = imgUri;
			$scope.onComplete = function() { $scope.imgUri = ""; };
			$scope.closeDialog = function() { $mdDialog.cancel(); };
			openModalService.showImageFullScreen(parentEl, ev, imgUri, $scope, $scope.onComplete, "Full Screen Image");
		}

		function acceptRequest(requestId, requesterId, requesterDisplayName) {

			// - Notify the requester thier request was accepted.
			// - Notify all supporters that the request was accepted.

			function onConfirm(buttonIndex) {
				if (buttonIndex === 1) {
					requestService.setRequestToAccepted(requestId).then(function() {
						// The update succeeded.
						console.log("The update succeeded");
					}), function(error) {
						// The update failed.
						console.error(error);
					};
				}
			}

			navigator.notification.confirm(
				"Congratulations! You have decided to accept this request. " +
				"We will notify the 'Requester' " + requesterDisplayName + ", and everyone who gave thier support. " +
				"You will now be able to chat with " + requesterDisplayName + " to work out any details.",
				onConfirm,
				"Request Acceptance",
				["Continue", "Cancel"]
			);
		}

		function editRequest() {
			function onConfirm(buttonIndex) {
				if (buttonIndex === 1) {
					// Do Something
				}
			}

			navigator.notification.confirm(
				"You can edit a request so long as it has not been upvoted yet.",
				onConfirm,
				"Edit Request",
				["Edit", "Cancel"]
			);
		}

		function archiveRequest() {
			function onConfirm(buttonIndex) {
				if (buttonIndex === 1) {
					// Do Something
				}
			}

			navigator.notification.confirm(
				"Instead of permentalty deleting a request, you can archive it and unarchive it at a later date. This will take the request offline.",
				onConfirm,
				"Archive Request",
				["Archive", "Cancel"]
			);
		}

		function ignoreRequestUntil() {
			function onConfirm(buttonIndex) {
				if (buttonIndex === 1) {
					// Do Something
				}
			}

			navigator.notification.confirm(
				"You can set this request to be ignored until it reaches a request count threshold. The request will remain online; it just will be removed from your active list.",
				onConfirm,
				"Ignore Request",
				["Continue", "Cancel"]
			);
		}

		function deleteRequestForever() {
			function onConfirm(buttonIndex) {
				if (buttonIndex === 1) {
					// Do Something
				}
			}

			navigator.notification.beep(1);
			navigator.notification.confirm(
				"Are you sure you want to delete this request? This action cannot be reversed.",
				onConfirm,
				"Delete Forever",
				["DELETE FOR GOOD", "NO!"]
			);
		}

		function openThanksConfirm() {
			function onConfirm(buttonIndex) {
				if (buttonIndex === 1) {
					// Do Something
				}
			}

			navigator.notification.confirm(
				"Would you like to send a thank-you? It will show up as a notification.",
				onConfirm,
				"Send a Thank You",
				["Yes!", "Nevermind"]
			);
		}

		function openChatConfirm(type, requesterDisplayName, userId) {

			var text = "", header = "";
			if (type === "accepted") {
				header = "Open Chat";
				text = "Start a chat with " + requesterDisplayName + "?";
			} else {
				header = "Send a Message";
				text = "Would you like to send a personal message to " + requesterDisplayName + "?";
			}

			function onConfirm(buttonIndex) {
				if (buttonIndex === 1) {
					$state.go("app.account", { areaName: "messages", userId: userId });
				}
			}

			navigator.notification.confirm(
				text,
				onConfirm,
				header,
				["Yes!", "Nevermind"]
			);

		}

		function reportRequest() {
			function alertDismissed() {
				// do something
			}

			navigator.notification.alert(
				"Sorry this feature has not been implemented yet.", // message
				alertDismissed, // callback
				"Report This Request", // title
				"OK" // buttonName
			);
		};
		// TEST THIS: _userId
		function upVote(requestId, requesterId, title) {
			function onConfirm(buttonIndex) {
				if (buttonIndex === 1) {
					$state.go("app.login", { reload: true });
				}
			}
			if (!_userId) {
				navigator.notification.confirm(
					"You need to be signed in to upvote.",
					onConfirm,
					"Login Needed",
					["Sign In", "Nevermind"]
				);
			} else {
				var userId = _userId;
				supporterService.upvoteRequest(requestId, userId, requesterId, title);
			}
		}

	};
})();