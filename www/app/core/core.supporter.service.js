(function() {
	"use strict";

	angular
		.module("app.core")
		.factory("supporterService", supporterService);

	supporterService.$inject = ["$timeout", "$state", "$rootScope", "$q", "$ionicPopup", "$firebaseArray", "$firebaseObject", "cordovaToast", "fbDataRef", "authService", "openModalService", "getClientIp"]; // "geoService",

	/* @ngInject */
	function supporterService($timeout, $state, $rootScope, $q, $ionicPopup, $firebaseArray, $firebaseObject, cordovaToast, fbDataRef, authService, openModalService, getClientIp) { //geoService

		var service = {
			getSupportersBySupportedUserId: getSupportersBySupportedUserId,
			upvoteRequest: upvoteRequest,
			checkIfUserUpvoted: checkIfUserUpvoted,
			incrementRequestCount: incrementRequestCount,
			SupporterObject: SupporterObject,
			showAlert: showAlert
		};

		return service;

		////////////////

		function getSupportersBySupportedUserId(supportedUserId) {
			var baseRef = fbDataRef.root;
			var normRef = new Firebase.util.NormalizedCollection(
					[baseRef.child("/requestSupporters"), "supporter"],
					[baseRef.child("/userProfiles"), "profile", "supporter.supporterUserId"],
					[baseRef.child("/requests"), "request", "supporter.requestId"],
					[baseRef.child("/requestAttachment"), "attachment", "supporter.requestId"],
					[baseRef.child("/requestCount"), "requestCount", "supporter.requestId"]
				).select(
					"supporter.supporterUserId",
					"supporter.supportedUserId",
					{ "key": "supporter.$key", "alias": "supporterRequestId" },
					{ "key": "supporter.IpAddress", "alias": "supporterIpAddress" },
					{ "key": "supporter.lat", "alias": "supporterLat" },
					{ "key": "supporter.long", "alias": "supporterLong" },
					{ "key": "supporter.timestamp", "alias": "supporterCreatedAt" },
					{ "key": "supporter.requestId", "alias": "requestId" },
					"profile.name",
					"profile.displayName",
					"profile.picture",
					"profile.userId",
					"request.title",
					"request.description",
					"request.requester",
					"request.receiver",
					"request.createdAt",
					"request.isDeleted",
					"request.isLive",
					{ "key": "attachment.secure_url", "alias": "attachmentSecureUri" },
					"requestCount.count"
				).filter(function(data) {
					return data.isLive === true && data.isDeleted === false;
				})
				.ref();

			var query = normRef.orderByChild("supportedUserId").equalTo(supportedUserId);
			return $firebaseArray(query); //JSON.stringify();
		}

		function checkIfUserUpvoted(title, supporterUserId, requestId) {
			var baseRef = fbDataRef.root;
			var normRef = new Firebase.util.NormalizedCollection(
					[baseRef.child("/requestSupporters"), "supporter"],
					[baseRef.child("/userProfiles"), "profile", "supporter.supporterUserId"],
					[baseRef.child("/requests"), "request", "supporter.requestId"]
				).select(
					"supporter.supporterUserId",
					"supporter.requestId",
					"supporter.requestTitle",
					"profile.displayNmae",
					"request.title"
				).filter(function(data) {
					return data.requestId === requestId;
				})
				.ref();

			return normRef.orderByChild("supporterUserId").equalTo(supporterUserId);
		}

		function upvoteRequest(requestId, userId, requesterId, title) {
			var query = fbDataRef.requests.child(requestId);
			query.once("value", function(snapshot) {
				var snap = snapshot.val();
				if (snap) {
					if (snap.requester === userId) {
						showAlert("owned");
					} else {
						var returnQuery = checkIfUserUpvoted(title, userId, requestId);
						returnQuery.once("value", function(dataSnapshot) {
							var count = _.values(dataSnapshot.val()).length;
							if (count === 0) {
								var ipAddress = "";
								// geoService.getCurrentPosition(function(position) {
									// if (position.coords.latitude) {
										getClientIp.async().then(function(data) {
											var response = data;
											ipAddress = response.data.ip;

											var ref = fbDataRef.requestSupporters;
											var supporterObj = new SupporterObject(title, requestId, userId, requesterId, ipAddress); // position
											var supporterList = $firebaseArray(ref);
											supporterList.$add(supporterObj).then(function() {
												incrementRequestCount(requestId);
												cordovaToast.show("Thanks! Request Upvoted.", "long", "bottom");
											});

										});
									// }
								// });
							} else {
								showAlert("upvoted");
							}
						});
					}
				} else {
					console.warn("There was a problem");
				}
			});
		}

		function incrementRequestCount(requestId) {
			var upvotesRef = fbDataRef.requestCount.child(requestId).child("count");
			upvotesRef.transaction(function(currentCount) {
				return currentCount + 1;
			});
		}

		function SupporterObject(requestTitle, requestId, userId, supportedUserId, ipAddress ) { // position
			this.requestTitle = requestTitle;
			this.requestId = requestId;
			this.IpAddress = ipAddress;
			this.lat = 0; // position.coords.latitude;
			this.long = 0; // position.coords.longitude;
			this.supportedUserId = supportedUserId;
			this.supporterUserId = userId;
			this.timestamp = authService.fbTimeStamp();
		}

		function showAlert(type) {
			var title, content;
			if (type === "upvoted") {
				title = "Thanks for your support!";
				content = "It looks like you have already upvoted this request. Only one upvote per user!";
			} else {
				title = "Sorry!";
				content = "You can't upvote your own request.";
			}

			function alertDismissed() {
				// do something
			}
			if (type) {
				navigator.notification.alert(
					content, // message
					alertDismissed, // callback
					title, // title
					"Got It!" // buttonName
				);
			}
		};
	}

})();