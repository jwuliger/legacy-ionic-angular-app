(function() {
	"use strict";

	angular
		.module("blocks.logger")
		.factory("logger", logger);

	//toastr
	logger.$inject = ["$log", "toastr"];

	/* @ngInject */
	function logger($log, toastr) {
		var service = {
			log: log,
			info: info,
			success: success,
			warn: warn,
			error: error,
			debug: debug
		};

		return service;

		/////////////////////

		function log(message, data) {
			$log.log("log: " + message, data);
		}

		function info(message, data) {
			toastr.info(message, "Information", data);
			$log.info("info: " + message);
		}

		function success(message, data) {
			toastr.success(message, "Success");
			$log.info("success: " + message, data);
		}

		function warn(message, data) {
			toastr.warning(message, "Warning", data);
			$log.warn("warn: " + message);
		}

		function error(message, data) {
			toastr.error(message, "Error");
			$log.error("error: " + message, data);
		}

		function debug(message, data) {
			$log.debug("debug: " + message, data);
		}
	}
}());