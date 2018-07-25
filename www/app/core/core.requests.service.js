(function() {
	"use strict";

	angular
		.module("app.core")
		.factory("requestService", requestService);

	requestService.$inject = ["$firebaseArray", "fbDataRef"];

	/* @ngInject */
	function requestService($firebaseArray, fbDataRef) {
		var _timeStamp = Firebase.ServerValue.TIMESTAMP;

		var service = {
			getRequestsByRequesterId: getRequestsByRequesterId,
			getRequestsByReceiverId: getRequestsByReceiverId,
			loadAllRequests: loadAllRequests,
			saveRequestMedia: saveRequestMedia,
			loadRequestCategories: loadRequestCategories,
			setRequestToAccepted: setRequestToAccepted,
			Request: Request,
			RequestCount: RequestCount,
			RequestAttachment: RequestAttachment
		};

		return service;

		/////////////////////

		function getRequestsByRequesterId(requesterId) {
			var baseRef = fbDataRef.root;
			var normRef = new Firebase.util.NormalizedCollection(
					[baseRef.child("/requests"), "request"],
					baseRef.child("/requestCount"),
					[baseRef.child("/userProfiles"), "profile", "request.receiver"],
					[baseRef.child("/requestAttachment"), "attachment"]
				).select(
					"request.title",
					"request.description",
					"request.requester",
					"request.receiver",
					"request.createdAt",
					"request.isDeleted",
					"request.isLive",
					"request.isAccepted",
					"requestCount.count",
					"profile.name",
					"profile.displayName",
					"profile.picture",
					{ "key": "attachment.secure_url", "alias": "attachmentSecureUri" }
				).filter(function(data) {
					if (requesterId) {
						return data.isLive === true && data.isAccepted === false && data.requester === requesterId;
					} else {
						return data.isLive === true && data.title !== "";
					}
				})
				.ref();

			var query = normRef.orderByChild("isDeleted").equalTo(false);
			return $firebaseArray(query);
		}

		function getRequestsByReceiverId(receiverId, returnType) {
			var baseRef = fbDataRef.root;
			var normRef = new Firebase.util.NormalizedCollection(
					[baseRef.child("/requests"), "request"],
					baseRef.child("/requestCount"),
					[baseRef.child("/userProfiles"), "profile", "request.requester"],
					[baseRef.child("/requestAttachment"), "attachment"]
				).select(
					"request.title",
					"request.description",
					"request.requester",
					"request.receiver",
					"request.createdAt",
					"request.isDeleted",
					"request.isLive",
					"request.isAccepted",
					"requestCount.count",
					"profile.name",
					"profile.displayName",
					"profile.picture",
					{ "key": "attachment.secure_url", "alias": "attachmentSecureUri" }
				).filter(function(data) {
					if (receiverId) {
						switch (returnType) {
						case "active":
							return data.isLive === true && data.isAccepted === false && data.receiver === receiverId;
						case "accepted":
							return data.isLive === true && data.isAccepted === true && data.receiver === receiverId;
						}
					} else {
						return data.isLive === true && data.title !== "";
					}
				})
				.ref();

			var query = normRef.orderByChild("isDeleted").equalTo(false);
			return $firebaseArray(query);
		}

		function loadAllRequests(returnType) {

			var isAccepted;
			if (returnType === "active") {
				isAccepted = false;
			} else {
				isAccepted = true;
			}

			var baseRef = fbDataRef.root;
			var normRef = new Firebase.util.NormalizedCollection(
					[baseRef.child("/requests"), "request"],
					baseRef.child("/requestCount"),
					[baseRef.child("/requestAttachment"), "attachment"]
				).select(
					"request.title",
					"request.description",
					"request.requester",
					"request.receiver",
					"request.createdAt",
					"request.isDeleted",
					"request.isLive",
					"request.isAccepted",
					"request.categoryName",
					"request.categoryId",
					"requestCount.count",
					{ "key": "attachment.secure_url", "alias": "attachmentSecureUri" }
				).filter(function(data) {
					return data.isLive === true && data.isDeleted === false;
				})
				.ref();

			var query = normRef.orderByChild("isAccepted").equalTo(isAccepted);
			return $firebaseArray(query);
		}

		function loadRequestCategories() {
			var baseRef = fbDataRef.root;
			var normRef = new Firebase.util.NormalizedCollection(
				[baseRef.child("/requests"), "request"],
				[baseRef.child("/categories"), "", "request.categoryId"]
			).select(
				"request.categoryName",
				"request.categoryId",
				"categories.createdAt"
			).ref();
			return $firebaseArray(normRef);
		}

		function setRequestToAccepted(requestId) {
			var ref = fbDataRef.requests.child(requestId);
			return ref.update(
			{
				isAccepted: true,
				acceptedAt: _timeStamp,
				updatedAt: _timeStamp
			});
		}

		function saveRequestMedia(recId, payLoad) {
			var requestAttachmentRef = fbDataRef.requestAttachment;
			requestAttachmentRef.child(recId).set(payLoad);
		}

		function Request() {
			this.title = "";
			this.requester = "";
			this.receiver = "";
			this.description = "";
			this.categoryId = "";
			this.categoryName = "";
			this.isAccepted = false;
			this.isDeleted = false;
			this.isLive = true;
			this.lat = 0;
			this.long = 0;
			this.appUsed = "mobile";
			this.createdAt = _timeStamp;
			this.updatedAt = _timeStamp;
			this.acceptedAt = _timeStamp;
		}

		function RequestCount() {
			this.count = 1;
			this.updatedAt = _timeStamp;
		}

		function RequestAttachment() {
			this.payload = "";
			this.updatedAt = _timeStamp;
		}
	}
})();