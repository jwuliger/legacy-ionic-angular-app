(function() {
	"use strict";

	angular
		.module("app")
		.directive("sendMessage", sendMessage);

	sendMessage.$inject = ["$rootScope", "$firebaseArray", "fbDataRef", "ChatService"];

	/* @ngInject */
	function sendMessage($rootScope, $firebaseArray, fbDataRef, ChatService) {
		return {
			require: "ngModel",
			restrict: "A",
			scope: {
				receiver: "=",
				room: "=",
				sender: "=",
				userProfile: "="
			},
			link: function(scope, element, attr, ngModel) {

				var $senderId = scope.sender;
				var $receiverId = scope.receiver;
				var $roomId = scope.room;
				var $userProfile = scope.userProfile;
				//console.log($senderId, $receiverId, $roomId, $userProfile);

				var messagesRef = fbDataRef.root.child("chatRoom_" + $roomId);
				messagesRef = $firebaseArray(messagesRef);

				element.bind("keydown", function(e) {
					if (e.which === 13) {

						var $message = ngModel.$modelValue;

						//add new message
						messagesRef.$add({ message: $message, senderId: $senderId, receiverId: $receiverId, created: Firebase.ServerValue.TIMESTAMP })
							.then(function(ref) {
								var messageId = ref.key();

								//This is the first message sent. Notify the receiver
								//   	that they have a conversation in play.
								ChatService.createChatNotification(messagesRef, messageId, $message, $userProfile, $roomId, $receiverId, $senderId);
							});

						//clear text value
						ngModel.$setViewValue("");
						element.val("");
						scope.$apply();
					}
				});
			}
		};
	}

})();