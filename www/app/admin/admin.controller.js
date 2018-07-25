(function() {
	"use strict";

	angular
		.module("app.admin")
		.controller("AdminController", AdminController);

	AdminController.$inject = ["categories", "authCheck", "Codes"];

	/* @ngInject */
	function AdminController(categories, authCheck, Codes) {
		var vm = this;

		// Make sure we have an authenticated user
		if (!authCheck) {
			//
		}

		vm.categories = categories;
		vm.createNewCategory = createNewCategory;

		function createNewCategory() {
			vm.categories.$add({ name: vm.newCategoryName, createdAt: Firebase.ServerValue.TIMESTAMP }).then(function() {
				Codes.showMessage("Category Added", 2000);
				vm.newCategoryName = "";
			});
		}

	}

})();