(function() {
	"use strict";

	angular.module("app.layout", [])
		.directive("multiBg", function(_) {
			return {
				scope: {
					multiBg: "=",
					interval: "=",
					helperClass: "@"
				},
				controller: function($scope, $timeout, $element) {
					$scope.loaded = false;
					var utils = this;

					this.animateBg = function() {
						// Think i have to use apply because this function is not called from this controller ($scope)
						$scope.$apply(function() {
							$scope.loaded = true;
							$element.css({ 'background-image': "url(" + $scope.bg_img + ")" });
						});
					};

					this.setBackground = function(bg) {
						$scope.bg_img = bg;
					};

					if (!_.isUndefined($scope.multiBg)) {
						if (_.isArray($scope.multiBg) && ($scope.multiBg.length > 1) && !_.isUndefined($scope.interval) && _.isNumber($scope.interval)) {

							//$scope.counter = 0;
							//var updateCounter = function () {
							//	$scope.counter++;
							//	if ($scope.counter <= $scope.multiBg.length - 1) {
							//		$timeout(updateCounter, $scope.interval);
							//	}
							//};
							//updateCounter();

							// Then we need to loop through the bg images
							utils.setBackground($scope.multiBg[0]);
						} else {
							// Then just set the multiBg image as background image
							utils.setBackground($scope.multiBg[0]);
						}
					}
				},
				templateUrl: "app/layout/multi-bg.html",
				restrict: "A",
				replace: true,
				transclude: true
			};
		})
		.directive("bg", function() {
			return {
				restrict: "A",
				require: "^multiBg",
				scope: {
					ngSrc: "@"
				},
				link: function(scope, element, attr, multiBgController) {
					element.on("load", function() {
						multiBgController.animateBg();
					});
				}
			};
		})
		.directive("uiSrefActiveIf", [
			"$state", function($state) {
				return {
					restrict: "A",
					controller: [
						"$scope", "$element", "$attrs", function($scope, $element, $attrs) {
							var state = $attrs.uiSrefActiveIf;

							function update() {
								if ($state.includes(state) || $state.is(state)) {
									$element.addClass("active");
								} else {
									$element.removeClass("active");
								}
							}

							$scope.$on("$stateChangeSuccess", update);
							update();
						}
					]
				};
			}
		]);


})();