(function() {
  "use strict";

  angular
    .module("app.request")
    .controller("RequestsController", RequestsController);

  RequestsController.$inject = [
    "$firebaseArray",
    "$scope",
    "$cordovaCamera",
    "fileTransfer",
    "cordovaToast",
    "fbDataRef",
    "userProfile",
    "$ionicHistory",
    "$state",
    "requestService"
    // ,"geoService"
  ];

  /* @ngInject */
  function RequestsController(
    $firebaseArray,
    $scope,
    $cordovaCamera,
    fileTransfer,
    cordovaToast,
    fbDataRef,
    userProfile,
    $ionicHistory,
    $state,
    requestService
    // geoService
  ) {
    // Methods //
    $scope.addRequest = addRequest;
    $scope.getPicture = getPicture;
    $scope.clearImagePreview = clearImagePreview;
    $scope.showImagePreview = showImagePreview;
    $scope.categoryChanged = categoryChanged;
    $scope.displayCategoryName = displayCategoryName;

    /////////////////////

    // Init //
    (function activate() {
      $scope.newRequest = new requestService.Request();
      $scope.requestCount = new requestService.RequestCount();
      $scope.requestAttachment = new requestService.RequestAttachment();
      $scope.categories = loadCategories();
    })();

    /////////////////////

    function loadCategories() {
      var ref = fbDataRef.categories;
      return $firebaseArray(ref);
    }

    function displayCategoryName(category) {
      if (category) {
        return category.name;
      } else {
        return "Please select the category they belong to.";
      }
    }

    function addRequest() {
      // geoService.getCurrentPosition(function(position) {
      // 	if (position.coords.latitude) {
      if (userProfile) {
        $scope.newRequest.lat = 0; // position.coords.latitude;
        $scope.newRequest.long = 0; // position.coords.longitude;
        $scope.newRequest.requester = userProfile.userId;
        $scope.newRequest.receiver = $scope.newRequest.receiver.userId;
        $scope.newRequest.categoryId = $scope.newRequest.category.$id;
        $scope.newRequest.categoryName = $scope.newRequest.category.name;
        $scope.newRequest.category = null;

        // First we need to create the request
        var requestRef = fbDataRef.requests;
        var requests = $firebaseArray(requestRef);
        requests.$add($scope.newRequest).then(function(ref) {
          var id = ref.key();

          // Now we create the related count entry
          var requestCountRef = fbDataRef.requestCount;
          requestCountRef.child(id).set($scope.requestCount);

          if ($scope.imageSrc) {
            fileTransfer
              .uploadFile($scope.imageSrc, "Request Uploads", "request", id)
              .then(function() {
                // redirect the user back to the landing page
                cordovaToast.show("Request Saved", "long", "bottom");
                redirect();
              });
          } else {
            cordovaToast.show("Request Saved", "long", "bottom");
            redirect();
          }
        });
      } else {
        console.log(
          "RequestsController - Add New Request",
          "Ukown Error Occured with loading 'userProfile'"
        );
      }
      // 	}
      // });
    }

    function redirect() {
      $ionicHistory.nextViewOptions({ disableBack: true });

      //$state.go("^");

      //$scope.changeState = function () {
      //	$state.go("app.landing", { reload: true });
      //};

      //$state.go("app.landing", { reload: true });
      $state.transitionTo("app.landing");
    }

    function getPicture(source) {
      document.addEventListener("deviceready", function() {
        var sourceType;
        if (source === "camera") {
          sourceType = Camera.PictureSourceType.CAMERA;
        } else {
          sourceType = Camera.PictureSourceType.SAVEDPHOTOALBUM;
        }

        var options = {
          quality: 80,
          destinationType: Camera.DestinationType.NATIVE_URI,
          sourceType: sourceType,
          mediaType: Camera.MediaType.PICTURE,
          allowEdit: false,
          encodingType: Camera.EncodingType.JPEG,
          correctOrientation: true
        };

        $cordovaCamera.getPicture(options).then(
          function(imageUri) {
            // This line is a test for iOS and the WkWKView nightmare.
            var localPath =
              "cdvfile://" +
              imageUri.substring(
                imageUri.lastIndexOf("/Users/"),
                imageUri.length
              );
            //localPath.replace("http://", "");

            showImagePreview(localPath); //imageUri
          },
          function(error) {
            console.log("New Request Camera Error", error);
          }
        );
      });
    }

    function clearImagePreview() {
      var imgPreviewDiv = document.getElementById("imgPreviewDiv");
      imgPreviewDiv.style.display = "none";
      $scope.picturePreviewMode = false;
    }

    function showImagePreview(imageUri) {
      var imgPreviewDiv = document.getElementById("imgPreviewDiv");
      var imgPreviewImg = document.getElementById("imgPreviewImg");
      imgPreviewDiv.style.display = "block";
      imgPreviewDiv.style.backgroundImage = "url(" + imageUri + ")";
      imgPreviewImg.src = imageUri;
      $scope.imageSrc = imageUri;
      $scope.picturePreviewMode = true;
    }

    function categoryChanged(category) {
      if (category) {
        var categoryId = category.$id;
        (function() {
          function filterCategory(data) {
            var findMatch = [];
            _.each(data.categories, function(value) {
              if (value.id === categoryId) {
                if (data.length !== 0) {
                  findMatch = data;
                }
              }
            });
            return findMatch;
          }

          var ref = fbDataRef.userProfiles;
          ref.orderByChild("categories").on("value", function(snapshot) {
            var findMatch = _.filter(
              _.map(snapshot.val(), filterCategory),
              function(element) {
                return element.length !== 0;
              }
            );
            $scope.userProfileData = findMatch;
            //console.log("$scope.userProfileData", $scope.userProfileData);
          });
        })();
      }
    }
  }
})();
