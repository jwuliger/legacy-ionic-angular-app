(function () {
	"use strict";

	angular
		.module("app.requests")
		.controller("BrowseRequestsController", BrowseRequestsController);

	BrowseRequestsController.$inject = ["$scope", "$state", "$stateParams", "$ionicHistory", "requestService", "filterModal"];

	/* @ngInject */
	function BrowseRequestsController($scope, $state, $stateParams, $ionicHistory, requestService, filterModal) {
		$ionicHistory.nextViewOptions({
			disableBack: true
		});

		$scope.showFilter = showFilter;

		$scope.$state = $state;
		$scope.areaName = $stateParams.areaName;
		$scope.currentNavItem = $stateParams.areaName;

		switch ($scope.areaName) {
			case "active":
				$scope.requestsActive = requestService.loadAllRequests("active");
				break;
			case "accepted":
				$scope.requestsAccepted = requestService.loadAllRequests("accepted");
				break;
		}

		function showFilter() {
			var scope = filterModal.scope;
			scope.vm = {
				categories: $scope.categories,
				selectedCategory: $scope.selectedCategory,
				applyFilters: applyFilters
			};

			filterModal.show();
		}

		function applyFilters() {
			filterModal.hide();

			var scope = filterModal.scope;
			$scope.selectedCategory = scope.vm.selectedCategory;
			
			// Now I need to apply the filter

		}

	}

})();