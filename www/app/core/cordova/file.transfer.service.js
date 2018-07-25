(function () {
	"use strict";

	angular
		.module("app.core")
		.factory("fileTransfer", fileTransfer);

	fileTransfer.$inject = ["$cordovaFileTransfer", "$q", "$window", "loaderService", "authService", "requestService", "logger", "userProfileDataLocalStorageKey", "NativeDeviceStorage"];

	/* @ngInject */
	function fileTransfer($cordovaFileTransfer, $q, $window, loaderService, authService, requestService, logger, userProfileDataLocalStorageKey, NativeDeviceStorage) {
		var service = {
			uploadFile: uploadFile
		};

		return service;

		/////////////////////

		function uploadFile(filePath, presetName, payloadType, requestId, userProfile) {
			if (!presetName) presetName = "Request Uploads";

			var deferred = $q.defer();

			document.addEventListener("deviceready", function () {

				var fileSize;
				var percentage;

				// Find out how big the original file is
				window.resolveLocalFileSystemURL(filePath, function (fileEntry) {
					fileEntry.file(function (fileObj) {
						fileSize = fileObj.size;
					});
				});

				// Server upload endpoint
				var uploadUri = "https://api.cloudinary.com/v1_1/requestit/image/upload";

				var options = {
					params: { "upload_preset": presetName, "file": "file" }
				};

				// Display the loading screen with 0%
				loaderService.showLoader("Upload Progress 0%");

				$cordovaFileTransfer.upload(uploadUri, filePath, options).then(function (result) {
					//logger.log("Response Data: ", JSON.parse(result.response));

					var imgResponse = JSON.parse(result.response);

					if (payloadType === "profile") {
						authService.createOrUpdateUserMedia(imgResponse);

						//var changedProfile = userProfile.picture = imgResponse.secure_url;
						//NativeDeviceStorage.set(changedProfile);

					} else {
						requestService.saveRequestMedia(requestId, imgResponse);
					}

					loaderService.hideLoader();
					return deferred.resolve(result);

				}, function (error) {
					loaderService.hideLoader();
					logger.log("File Transfer Error Data: ", JSON.stringify(error));

					return deferred.reject(error);

				}, function (progress) {
					percentage = Math.floor(progress.loaded / fileSize * 100);

					// Display the loading screen with realtime progress.
					loaderService.showLoader("Upload Progress " + percentage + "%");

					return deferred.notify(progress);

				});

			});
			return deferred.promise;
		};
	}
} ());