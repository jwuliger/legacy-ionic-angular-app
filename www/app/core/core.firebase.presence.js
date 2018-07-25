(function() {
	"use strict";

	angular
		.module("app.core")
		.factory("PresenceService", [
			"$rootScope", "fbDataRef", function ($rootScope, fbDataRef) {
				var onlineUsers = 0;

				var listRef = fbDataRef.presence;
				var userRef = listRef.push();

				// Add ourselves to presence list when online.
				var presenceRef = fbDataRef.presenceConnected;
				presenceRef.on("value", function(snap) {
					if (snap.val()) {
						userRef.set(true);
						
						// Remove ourselves when we disconnect.
						userRef.onDisconnect().remove();
					}
				});

				// Number of online users is the number of objects in the presence list.
				listRef.on("value", function(snap) {
					onlineUsers = snap.numChildren();
					$rootScope.$broadcast("onOnlineUser");
				});

				var getOnlineUserCount = function() {
					return onlineUsers;
				};
				return {
					getOnlineUserCount: getOnlineUserCount
				};
			}
		]);
})();