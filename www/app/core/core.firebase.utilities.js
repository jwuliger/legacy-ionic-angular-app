﻿(function () {
	"use strict";

	angular
		.module("app.core")
		.factory("fbUtilities", fbUtilities);

	fbUtilities.$inject = ["firebaseUrl", "$q"];

	/* @ngInject */
	function fbUtilities(firebaseUrl, $q) {

		var service = {

			// convert a node or Firebase style callback to a future
			handler: function (fn, context) {
				return service.defer(function (def) {
					fn.call(context, function (err, result) {
						if (err !== null) {
							def.reject(err);
						} else {
							def.resolve(result);
						}
					});
				});
			},

			// abstract the process of creating a future/promise
			defer: function (fn, context) {
				var def = $q.defer();
				fn.call(context, def);
				return def.promise;
			},

			ref: firebaseRef
		};

		return service;

		function pathRef(args) {
			for (var i = 0; i < args.length; i++) {
				if (angular.isArray(args[i])) {
					args[i] = pathRef(args[i]);
				} else if (typeof args[i] !== "string") {
					throw new Error("Argument " + i + " to firebaseRef is not a string: " + args[i]);
				}
			}
			return args.join("/");
		}

		/**
			* Example:
			* <code>
			*    function(firebaseRef) {
			*       var ref = firebaseRef('path/to/data');
			*    }
			* </code>
			*
			* @function
			* @name firebaseRef
			* @param {String|Array} path relative path to the root folder in Firebase instance
			* @return a Firebase instance
			*/
		function firebaseRef(path) {
			var ref = new Firebase(firebaseUrl);
			var args = Array.prototype.slice.call(arguments);
			if (args.length) {
				ref = ref.child(pathRef(args));
			}
			return ref;
		}

	}

})();