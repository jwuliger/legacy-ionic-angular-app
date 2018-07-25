(function() {
	"use strict";

	angular
		.module("app.core")
		.factory("fbDataRef", fbDataRef);

	fbDataRef.$inject = ["firebaseUrl"];

	function fbDataRef(firebaseUrl) {

		var root = new Firebase(firebaseUrl);

		var service = {
			root: root,
			users: root.child("users"),
			userProfiles: root.child("userProfiles"),
			userMedia: root.child("userMedia"),
			userSettings: root.child("userSettings"),
			requests: root.child("requests"),
			requestCount: root.child("requestCount"),
			requestAttachment: root.child("requestAttachment"),
			requestSupporters: root.child("requestSupporters"),
			feedbackMessages: root.child("feedbackMessages"),
			categories: root.child("categories"),
			userChatNotifications: root.child("userChatNotifications"),
			presence: root.child("/presence"),
			presenceConnected: root.child(".info/connected")
		};

		return service;
	}

})();