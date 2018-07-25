/*(function () {
	"use strict";

	angular
		.module("app.admin")


		.run(function ($rootScope, $location) {
			$rootScope.$on("$routeChangeError", function (e, next, prev, err) {
				if (err === "AUTH_REQUIRED") {
					$location.path("/login");
				}
			});
		})
		.config(function ($routeProvider) {
			$routeProvider
				.when("/admin", {
					template: '<category-list categories="$resolve.categories"></category-list>',
					resolve: {
						categories: function (fbDataRef, $firebaseArray, fbAuth) {
							return fbAuth.$requireAuth().then(function () {
								var query = fbDataRef.categories.orderByChild("name");
								return $firebaseArray(query).$loaded();
							});
						}
					}
				});
			//.otherwise("/home");
		});


})();
*/

(function () {
	"use strict";

	angular
		.module("app.admin")
		.run(appRun);

	appRun.$inject = ["routerHelper"];

	/* @ngInject */
	function appRun(routerHelper) {
		routerHelper.configureStates(getStates());
	}

	function getStates() {
		return [
			{
				state: "app.admin",
				config: {
					url: "/admin",
					views: {
						'viewName': {
							cache: false,
							templateUrl: "app/admin/admin.load.html",
							controller: "AdminController",
							controllerAs: "vm",
							title: "Admin",
							resolve: {
								categories: function (fbDataRef, $firebaseArray, fbAuth) {
									return fbAuth.$requireAuth().then(function () {
										var query = fbDataRef.categories.orderByChild("name");
										return $firebaseArray(query).$loaded();
									});
								}
							}
						}
					}
				}
			}
		];
	}

})();