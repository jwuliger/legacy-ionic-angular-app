(function() {
	"use strict";

	angular
		.module("app.chat")
		.run(appRun);

	appRun.$inject = ["$http", "routerHelper"];

	/* @ngInject */
	function appRun($http, routerHelper) {
		routerHelper.configureStates(getStates());
	}

	function getStates() {
		return [
			{
				state: "app.chat",
				config: {
					url: "/chat",
					views: {
						'viewName': {
							templateUrl: "app/chat/chat.html",
							controller: "ChatController",
							controllerAs: "vm",
							title: "Conversations"
						}
					}
				}
			},
			{
				state: "app.chat-detail",
				config: {
					url: "/chat/:roomId/:receiverId/:receiverName",
					views: {
						'viewName': {
							templateUrl: "app/chat/chat-detail.html",
							controller: "ChatDetailController",
							controllerAs: "vm"
						}
					},
					resolve: {
						'userProfile': function (NativeDeviceStorage) {
							return NativeDeviceStorage.get();
						}
					}
				}
			}
		];
	}
})();