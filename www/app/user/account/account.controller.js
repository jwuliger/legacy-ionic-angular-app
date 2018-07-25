(function() {
	"use strict";

	angular
		.module("app.user")
		.controller("AccountController", AccountController);

	AccountController.$inject = ["$scope", "$q", "$mdSidenav", "$state", "$compile", "$window", "$stateParams", "$mdToast", "$ionicLoading", "$cordovaCamera", "$firebaseArray", "$firebaseObject", "fbDataRef", "userProfile", "requestService", "supporterService", "fileTransfer", "authService", "ChatService"];

	/* @ngInject */
	function AccountController($scope, $q, $mdSidenav, $state, $compile, $window, $stateParams, $mdToast, $ionicLoading, $cordovaCamera, $firebaseArray, $firebaseObject, fbDataRef, userProfile, requestService, supporterService, fileTransfer, authCheck, ChatService) {
		var vm = this;

		$scope.$state = $state;

		var originatorEv;
		vm.openMenu = function($mdOpenMenu, ev) {
			originatorEv = ev;
			$mdOpenMenu(ev);
		};

		$scope.toggleRight = function() {
			$mdSidenav("right").toggle();
		};

		$scope.close = function() {
			$mdSidenav("right").close()
				.then(function() {
					//console.debug("close RIGHT is done");
				});
		};

		// moment js
		vm.moment = window.moment;

		vm.getPicture = getPicture;

		var loggedInUserId = userProfile.userId;
		//console.log("loggedInUserId", loggedInUserId);

		$scope.$on("$ionicView.enter", function() {
			if (loggedInUserId) {

				// get the area we are in
				$scope.areaName = $stateParams.areaName;
				//console.log("$scope.areaName", $scope.areaName);

				switch ($scope.areaName) {
				case "profile":
					$scope.headerName = "Manage Your Profile";

					vm.categories = $firebaseArray(fbDataRef.categories);

					// Init three-way data binding
					var bind = $firebaseObject(fbDataRef.userProfiles.child(loggedInUserId));
					bind.$bindTo($scope, "userProfileBinded");

					break;
				case "settings":
					$scope.headerName = "Settings & Preferences";
					break;
				case "requests-made":
					$scope.headerName = "Requests I Made";

					vm.requestsMade = requestService.getRequestsByRequesterId(loggedInUserId);
					//console.log("vm.requestsMade", vm.requestsMade);

					break;
				case "requests-received":
					$scope.headerName = "Requests I've Received";

					vm.requestsReceivedActive = requestService.getRequestsByReceiverId(loggedInUserId, "active");
					//console.log("vm.requestsReceived", vm.requestsReceivedActive);

					vm.requestsReceivedAccepted = requestService.getRequestsByReceiverId(loggedInUserId, "accepted");
					//console.log("vm.requestsReceivedAccepted", vm.requestsReceivedAccepted);

					break;
				case "supporters":
					$scope.headerName = "My Supporters";

					vm.activeSupporters = supporterService.getSupportersBySupportedUserId(loggedInUserId);
					//console.log("vm.activeSupporters", vm.activeSupporters);

					break;
				case "stats":
					$scope.headerName = "General Statistics";
					break;
				case "messages":
					$scope.headerName = "Private Messaging";

					vm.chatSessions = ChatService.loadChatSessionsByUser(loggedInUserId);
					//console.log("vm.chatSessions", vm.chatSessions);

					break;
				}
			}
		});

		$scope.clearSearchTerm = function() {
			$scope.searchTerm = "";
		};

		// The md-select directive eats keydown events for some quick select
		// logic. Since we have a search input here, we don't need that logic for a mobile app.
		angular.element("input").on("keydown", function(ev) {
			ev.stopPropagation();
		});

		function getPicture(source, optTargetSize) {
			document.addEventListener("deviceready", function() {

				var q = $q.defer();

				var targetSizeTarget = 800;
				if (optTargetSize != undefined && optTargetSize !== "") {
					targetSizeTarget = optTargetSize;
				};

				var sourceType;
				if (source === "camera") {
					sourceType = Camera.PictureSourceType.CAMERA;
				} else {
					sourceType = Camera.PictureSourceType.PHOTOLIBRARY;
				}

				var options = {
					quality: 100,
					destinationType: window.Camera.DestinationType.FILE_URI,
					sourceType: sourceType,
					allowEdit: true,
					targetWidth: targetSizeTarget,
					targetHeight: targetSizeTarget,
					encodingType: window.Camera.EncodingType.JPEG,
					popoverOptions: window.CameraPopoverOptions,
					saveToPhotoAlbum: false,
					correctOrientation: true
				};

				$cordovaCamera.getPicture(options).then(
					function(imageUri) {
						if (imageUri) {
							q.resolve(fileTransfer.uploadFile(imageUri, "Profile Image Uploads", "profile", "", userProfile));
						} else {
							q.reject(console.log("Camera Error", "Missing the imageUri from the getPicture() method. Unknown."));
						}
					},
					function(error) {
						q.reject(console.log("Camera Error", error));
					});
			});
		}


		// Goole Maps
		//////////////////////////////////////////

		//function initialize() {
		//	var myLatlng = new google.maps.LatLng(43.07493, -89.381388);

		//	var mapOptions = {
		//		center: myLatlng,
		//		zoom: 16,
		//		mapTypeId: google.maps.MapTypeId.ROADMAP
		//	};
		//	var map = new google.maps.Map(document.getElementById("map"),
		//		mapOptions);

		//	//Marker + infowindow + angularjs compiled ng-click
		//	var contentString = "<div><a ng-click='clickTest()'>Click me!</a></div>";
		//	var compiled = $compile(contentString)($scope);

		//	var infowindow = new google.maps.InfoWindow({
		//		content: compiled[0]
		//	});

		//	var marker = new google.maps.Marker({
		//		position: myLatlng,
		//		map: map,
		//		title: "Uluru (Ayers Rock)"
		//	});

		//	google.maps.event.addListener(marker, "click", function () {
		//		infowindow.open(map, marker);
		//	});

		//	$scope.map = map;
		//}

		//google.maps.event.addDomListener($window, "load", initialize);

		//$scope.centerOnMe = function () {
		//	if (!$scope.map) {
		//		return;
		//	}

		//	$scope.loading = $ionicLoading.show({
		//		content: "Getting current location...",
		//		showBackdrop: false
		//	});

		//	navigator.geolocation.getCurrentPosition(function (pos) {
		//		$scope.map.setCenter(new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude));
		//		$scope.loading.hide();
		//	}, function (error) {
		//		alert("Unable to get location: " + error.message);
		//	});
		//};

		//$scope.clickTest = function () {
		//	alert("Example of infowindow with ng-click");
		//};

		//////////////////////////////////////////


		// TEMP CODE //
		$scope.toast = function(message) {
			var toast = $mdToast.simple().content("You clicked " + message).position("bottom right");
			$mdToast.show(toast);
		};
		$scope.toastList = function(message) {
			var toast = $mdToast.simple().content("You clicked " + message + " having selected " + $scope.selected.length + " item(s)").position("bottom right");
			$mdToast.show(toast);
		};
		$scope.selected = [];
		$scope.toggle = function(item, list) {
			var idx = list.indexOf(item);
			if (idx > -1) list.splice(idx, 1);
			else list.push(item);
		};

		$scope.data = {
			content: {
				lists: [
					{
						name: "Social Preferences",
						menu: {
							name: "User Permission",
							icon: "settings",
							width: "4",
							actions: [
								{
									name: "Setup",
									message: "Setup",
									completed: true,
									error: false
								}
							]
						},
						items: [
							{
								name: "Twitter",
								description: "Send a tweet when I make or upvote a request.",
								link: "Twitter Settings"
							}, {
								name: "Facebook",
								description: "Post on my wall when I make or upvote a request.",
								link: "Facebook Settings"
							}, {
								name: "Instagram",
								description: "Post on my wall when I make or upvote a request.",
								link: "Instagram Settings"
							}, {
								name: "Pinterest",
								description: "Pin my request or upvote on my board.",
								link: "Pinterest Settings"
							}
						]
					},
					{
						name: "Notification Preferences",
						menu: {
							name: "Frequency",
							icon: "settings",
							width: "4",
							actions: [
								{
									name: "Instantly",
									message: "Set to Instantly",
									completed: true,
									error: false
								},
								{
									name: "Daily",
									message: "Set to Daily",
									completed: true,
									error: false
								},
								{
									name: "Weekly",
									message: "Set to Daily",
									completed: true,
									error: false
								}
							]
						},
						items: [
							{
								name: "New Supporter",
								description: "Notify me when I get a new supporter.",
								link: "N/A"
							}, {
								name: "New Message",
								description: "Notify me when I get a new message.",
								link: "N/A"
							}, {
								name: "Request Upvoted",
								description: "Notify me when I get an upvote.",
								link: "N/A"
							}
						]
					}
				]
			}
		};
	}

})();