﻿(function() {
	"use strict";

	angular
		.module("app.feedback")
		.factory("FeedbackFactory", FeedbackFactory);

	FeedbackFactory.$inject = ["$q", "fbDataRef"];

	function FeedbackFactory($q, fbDataRef) {

		var messagesList = fbDataRef.feedbackMessages;

		var MessageRef = function() {
			return messagesList.push();
		};

		var Message = function(data, isValid) {
			this.ref = new MessageRef();
			this.data = data;
			this.data.submitAt = Firebase.ServerValue.TIMESTAMP;
			this.data.submitAtString = Date(this.data.submitAt);
			this.valid = isValid;
			return this;
		};

		Message.prototype.submit = function() {
			var deferred = $q.defer();
			var that = this;
			if (this.valid) {
				this.ref.set(this.data, function(error) {
					if (error) {
						deferred.reject(error);
					} else {
						deferred.resolve(that.data);
					}
				});
			} else {
				deferred.reject("Invalid entry");
			}
			return deferred.promise;
		};

		return function(messageData, messageIsValid) {
			return new Message(messageData, messageIsValid);
		};
	}
})();