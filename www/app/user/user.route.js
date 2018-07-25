(function() {
	"use strict";

	angular
		.module("app.user")
		.run(appRun);

	appRun.$inject = ["fbAuth", "routerHelper"];

	/* @ngInject */
	function appRun(fbAuth, routerHelper) {
		routerHelper.configureStates(getStates());
	}

	function getStates() {
		return [
			{
				state: "app.login",
				config: {
					url: "/login",
					views: {
						'viewName': {
							templateUrl: "app/user/login/login.html",
							controller: "LoginController",
							controllerAs: "vm",
							title: "Login"
						}
					}
				}
			},
			{
				state: "app.register",
				config: {
					url: "/register",
					views: {
						'viewName': {
							templateUrl: "app/user/register/register.html",
							controller: "RegisterController",
							controllerAs: "vm",
							title: "Register"
						}
					}
				}
			},
			{
				state: "app.account",
				config: {
					url: "/account/:areaName",
					views: {
						'viewName': {
							templateUrl: "app/user/account/account.html",
							controller: "AccountController",
							controllerAs: "vm",
							title: "Account"
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