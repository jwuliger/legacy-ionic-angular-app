(function() {
	"use strict";

	angular
		.module("app.core")
		.factory("ChatService", ChatService);

	ChatService.$inject = ["$firebaseArray", "fbUtilities", "fbDataRef"];

	/* @ngInject */
	function ChatService($firebaseArray, fbUtilities, fbDataRef) {
		var service = {
			createChatNotification: createChatNotification,
			loadChatSessionsByUser: loadChatSessionsByUser
		};

		return service;

		////////////

		function loadChatSessionsByUser(receiverId) {
			var ref = fbDataRef.userChatNotifications;
			ref.orderByChild(receiverId);
			return $firebaseArray(ref);
		}

		function createChatNotification(messagesRef, messageId, $message, $userProfile, $roomId, $receiverId, $senderId) {
			//This is the first message sent. Notify the receiver
			//   	that they have a conversation in play.
			if (messagesRef.$indexFor(messageId) === 0) {
				var receiverRef = fbUtilities.ref("userProfiles", $receiverId);
				receiverRef.once("value", function (snapshot) {
					var theReceiver = snapshot.val();
					var notifyRef = fbUtilities.ref("userChatNotifications", $receiverId);
					receiverRef.once("value", function () {
						fbUtilities.handler(function (cb) {
							var notifyObj = {
								roomId: $roomId,
								created: Firebase.ServerValue.TIMESTAMP,
								receiverId: $receiverId,
								receiverName: theReceiver.displayName,
								receiverProfilePicture: theReceiver.picture,
								senderId: $senderId,
								senderName: $userProfile.displayName,
								senderProfilePicture: $userProfile.picture,
								receiverAcknowledged: false,
								receiverAlerted: false,
								introMsg: $message
							}
							notifyRef.set(notifyObj, cb);
						});
					});
				});
			}
		};

	}

})();