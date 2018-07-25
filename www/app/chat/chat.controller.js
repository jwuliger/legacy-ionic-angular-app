(function() {
	"use strict";

	angular
		.module("app.chat")
		.controller("ChatController", ChatController)
		.controller("ChatDetailController", ChatDetailController);

	ChatController.$inject = ["$scope", "$firebaseArray", "authCheck", "fbDataRef"];

	/* @ngInject */
	function ChatController($scope, $firebaseArray, authCheck, fbDataRef) {

		// Make sure we have an authenticated user
		if (!authCheck) {
			//
		}

		this.loadAllUserProfiles = loadAllUserProfiles;
		$scope.users = loadAllUserProfiles();

		function loadAllUserProfiles() {
			var ref = fbDataRef.userProfiles;
			return $firebaseArray(ref);
		}
	}

	ChatDetailController.$inject = ["$scope", "$timeout", "$stateParams", "fbDataRef", "authCheck", "userProfile", "$ionicScrollDelegate"];

	/* @ngInject */
	function ChatDetailController($scope, $timeout, $stateParams, fbDataRef, authCheck, userProfile, $ionicScrollDelegate) {

		// Make sure we have an authenticated user
		if (!authCheck) {
			//
		}

		$scope.userProfile = userProfile;
		$scope.receiverId = $stateParams.receiverId;
		$scope.receiverName = $stateParams.receiverName;
		$scope.roomId = $stateParams.roomId;
		$scope.endOfContent = false;
		$scope.messages = {};

		// moment js
		$scope.moment = window.moment;

		var itemPerPage = 15;

		var messagesRef = fbDataRef.root.child("chatRoom_" + $scope.roomId);
		var messages = {
			numChildren: 0,
			limit: itemPerPage,
			get: function(callbackFunc) {
				messagesRef.orderByKey().limitToLast(messages.limit).once("value", function(snapshot) {
					if (snapshot.exists()) {
						// console.log(messages.numChildren +"=="+ snapshot.numChildren());
						if (messages.numChildren === snapshot.numChildren()) {
							$scope.endOfInternet = true;
							return;
						}

						var msg = snapshot.val();
						callbackFunc(msg);
						messages.limit += itemPerPage;
						messages.numChildren = snapshot.numChildren();
					}
				});
			}
		};

		messagesRef.orderByKey().limitToLast(messages.limit).on("child_added", function(snapshot, prevChildKey) {
			if (snapshot.exists()) {
				var newPost = snapshot.val();
				var msg = {};
				msg[snapshot.key()] = newPost;
				$scope.messages = angular.extend($scope.messages, msg);

				//scroll to bottom
				$timeout(function() {
					$ionicScrollDelegate.scrollBottom();
				});
			}
		});

		var $senderId = $scope.userProfile.userId;
		$scope.senderId = $senderId;

		$scope.doRefresh = function() {
			messages.get(function(msg) {
				// console.log(msg);
				$scope.messages = msg;
				$scope.$broadcast("scroll.refreshComplete");
			});
		};
	}
})();