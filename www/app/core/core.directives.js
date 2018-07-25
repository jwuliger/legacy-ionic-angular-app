(function() {
	"use strict";

	angular
		.module("app.core")
		.directive("compareTo", compareTo);
	compareTo.$inject = [];

	/* @ngInject */
	function compareTo() {
		return {
			require: "ngModel",
			scope: {
				otherModelValue: "=compareTo"
			},
			link: function(scope, element, attributes, ngModel) {

				ngModel.$validators.compareTo = function(modelValue) {
					return modelValue === scope.otherModelValue;
				};

				scope.$watch("otherModelValue", function() {
					ngModel.$validate();
				});
			}
		};
	}
})();

(function() {
	"use strict";

	angular
		.module("app.core")
		.directive("shareIconButton", compareTo);
	compareTo.$inject = [];

	/* @ngInject */
	function compareTo() {
		return {
			restrict: "E",
			replace: true,
			scope: false,
			template: '<button class="button button-icon" on-touch="shareWithOptions()"></button>',

			compile: function(element, attrs) {
				var icon = ionic.Platform.isIOS() ? "ion-ios-upload-outline" : "ion-share";
				angular.element(element[0]).addClass(icon);
			}
		};
	}
})();

(function() {
	"use strict";

	angular
		.module("app.core")
		.directive("riAppVersion", appVersionDirective);

	appVersionDirective.$inject = ["appVersion"];

	/* @ngInject */
	function appVersionDirective(appVersion) {
		return function(scope, elm) {
			elm.text(appVersion);
		};
	}
})();

(function() {
	"use strict";

	/**
		* @name bindTemplateTo
		* @description
		* 		Example Use:
		*		<div bind-template-to="dataModel" template-url="/../.."></div>
		*			In the template:
		*			<input ng-model="dataModel.property" ...>
		*/

	angular
		.module("app.core")
		.directive("bindTemplateTo", function() {
			return {
				restrict: "A",
				scope: {
					data: "=bindTemplateTo"
				},
				templateUrl: function(element, attr) { return attr.templateUrl; }
			};
		});
})();

(function () {
	"use strict";

	angular
		.module("app.core")
		.component("displayUserInfo", {
			//isolate: false,
			replace: true,
			bindings: {
				uid: "@",
				area: "=",
				type: "@"
			},
			controller: ControllerFunction,
			template: "<div layout='row' layout-align='start center'><span><img ng-src='{{$ctrl.tProfilePicture}}'></span><span>{{$ctrl.tName}}</span></div>"
		})
		.controller("ControllerFunction", ControllerFunction);

	// ----- ControllerFunction -----
	ControllerFunction.$inject = ["$scope", "fbDataRef"];

	/* @ngInject */
	function ControllerFunction($scope, fbDataRef) {
		var ctrl = this;
		if (ctrl.uid) {
			fbDataRef.root.child("userProfiles").child(ctrl.uid).once("value").then(function (snapshot) {
				var data = snapshot.val();
				var tName = data.displayName;
				if (ctrl.area === "supporters") {
					tName = "Supported by " + tName;
				} else {
					if (ctrl.type === "requester") {
						tName = "Requested by " + tName;
					}
				}

				if (ctrl.area === "supporters") {
					$scope.$apply(function() {
						ctrl.tName = tName;
						ctrl.tProfilePicture = data.picture;
					});
				} else {
					ctrl.tName = tName;
					ctrl.tProfilePicture = data.picture;
				}
			});
		}
	}
})();