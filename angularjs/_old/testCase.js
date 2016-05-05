angular.module("testManApp")
.constant("testcaseUrl", "http://127.0.0.1:8000/api/testcases/")
.factory("testcaseResource", function ($resource, testcaseUrl){
	return $resource(testcaseUrl)
})
.config(function ($resourceProvider) {
	$resourceProvider.defaults.stripTrailingSlashes = false;
})
.controller("testcaseCtrl", function ($scope, testcaseResource) {
	$scope.data = {}; // defined as an object

	testcaseResource.query().$promise.then(function(data){
		// console.log(data);
		var testList = [];
		for (var i = 0; i < data.length; i++){
			testList.push(data[i]);
		}
		$scope.data.testcases = testList;
		// console.log($scope.data.testcases);
	});

})