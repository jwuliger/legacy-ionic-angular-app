(function() {
	"use strict";

	angular
		.module("app.core")
		.config(function($provide) {

			// Example usage: $state.forceReload();

			$provide.decorator("$state", function($delegate, $stateParams) {
				$delegate.forceReload = function() {
					return $delegate.go($delegate.current, $stateParams, {
						reload: true,
						inherit: false,
						notify: true
					});
				};
				return $delegate;
			});
		});

})();