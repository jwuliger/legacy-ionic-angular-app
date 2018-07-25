(function() {
	"use strict";

	angular
		.module("app")
		.factory("openModalService", openModalService);

	openModalService.$inject = ["$mdDialog"];

	function openModalService($mdDialog) {
		var service = {
			confirm: confirm,
			alert: alert,
			showImageFullScreen: showImageFullScreen
		};

		return service;

		///////////////////

		function confirm(dataObj, title, content, ariaLabel, okText, cancelText) {
			var conf = $mdDialog.confirm()
				.title(title)
				.htmlContent(content)
				.ariaLabel(ariaLabel)
				.ok(okText)
				.cancel(cancelText);
			return $mdDialog.show(conf);
		}

		function alert(title, content, ariaLabel, okText) {
			$mdDialog.show(
				$mdDialog.alert()
				.title(title)
				.content(content)
				.ariaLabel(ariaLabel)
				.ok(okText)
				.clickOutsideToClose(true)
			);
		}

		function showImageFullScreen(parent, targetEvent, imgUri, scope, onComplete, ariaLabel) {
			return $mdDialog.show({
				parent: parent,
				targetEvent: targetEvent,
				fullscreen: true,
				hasBackdrop: false,
				scope: scope,
				preserveScope: true,
				template: "<md-dialog class='.image-modal' aria-label='Request Image' ng-click='closeDialog()'><img ng-src='{{imgUri}}' alt='' class='fullscreen-image'></md-dialog>",
				onComplete: onComplete,
				ariaLabel: ariaLabel
			});
		}
	}
})();