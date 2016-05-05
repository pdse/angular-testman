angular.module("testManApp", ['treeControl','ngResource'])
.constant("treeUrl", "http://127.0.0.1:8000/api/tree/")
.factory("treeResource", function ($resource, treeUrl) {
	return $resource(treeUrl)
})
.config(function ($resourceProvider) {
	$resourceProvider.defaults.stripTrailingSlashes = false;
})
.constant("testcaseUrl", "http://127.0.0.1:8000/api/testcases/")
.factory("testcaseResource", function ($resource, testcaseUrl){
	return $resource(testcaseUrl)
})
.controller("treeCtrl", function ($scope, treeResource, testcaseResource) {

	$scope.data = {};
	$scope.data.tree = [];
	treeResource.query().$promise.then(function (data) {
		angular.forEach(data, function(domain, index){
			// console.log(domain.name)
			var domElement = {};
			domElement.level = "domain";
			domElement.name = domain.name;
			domElement.id = domain.id;
			domElement.children = [];
			if (angular.isArray(domain.systems) && domain.systems.length != 0) {
				// process the systems belong to the domain
				angular.forEach(domain.systems, function(system, index){
					// console.log(system.name)
					var sysElement = {};
					sysElement.level = "system";
					sysElement.name = system.name;
					sysElement.id = system.id;
					sysElement.children = [];
					if (angular.isArray(system.functions) && system.functions.length != 0){
						// process the function belong to the system
						angular.forEach(system.functions, function(efunction, index){
							// console.log(efunction.name)
							var funElement = {};
							funElement.level = "function";
							funElement.name = efunction.name;
							funElement.id = efunction.id;
							funElement.children = [];
							if (angular.isArray(efunction.features) && efunction.features.length != 0){
								// proces the features belong to the function
								angular.forEach(efunction.features, function(feature, index){
									var feaElement = {};
									feaElement.level = "feature";
									feaElement.name = feature.name;
									feaElement.id = feature.id;
									feaElement.children = [];
									funElement.children.push(feaElement);
								})
							} else {
								// do nothing
							}
							sysElement.children.push(funElement);
						})
					} else {
						// do nothing
					}
					domElement.children.push(sysElement);
				})
			} else {
				// do nothing
			}
			$scope.data.tree.push(domElement);
		})

		return $scope.data.tree;
	});

	$scope.showSelected = function(sel) {
		$scope.selectedNode = sel;
		$scope.featureList = []
		if (sel.level == "feature") {
			$scope.featureList.push(sel.name);
		} else if (sel.level == "function") {
			angular.forEach(sel.children, function (objFeature, index) {
				$scope.featureList.push(objFeature.name);
			})
		} else if (sel.level == "system") {
			angular.forEach(sel.children, function (objFunction, index) {
				angular.forEach(objFunction.children, function(objFeature, indexe){
					$scope.featureList.push(objFeature.name)
				})
			})
		} else if (sel.level == "domain") {
			angular.forEach(sel.children, function (objSystem, index) {
				angular.forEach(objSystem.children, function(objFunction, index){
					angular.forEach(objFunction.children, function(objFeature, index){
						$scope.featureList.push(objFeature.name)
					})
				})
			})
		}
	};

	$scope.data.testcases = [];
	testcaseResource.query().$promise.then(function(testcases){
		angular.forEach(testcases, function(testcase, index){
			$scope.data.testcases.push(testcase)
		})
	});
});