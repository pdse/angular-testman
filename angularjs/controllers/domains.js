angular.module("exampleApp", ["ngResource", "ngRoute"])
.constant("domainUrl", "http://127.0.0.1:8000/api/domains/")
.factory("domainsResource", function ($resource, domainUrl) {
	return $resource(domainUrl + ":id" + "/", { id: "@id"},
		{ create: { method: "POST"}, save: {method: "PUT"}} );
})
.config(function ($resourceProvider) {
	$resourceProvider.defaults.stripTrailingSlashes = false;
})
.config(function ($routeProvider, $locationProvider) {
	$locationProvider.html5Mode({
		enabled: true,
		requireBase: false
	});
	$routeProvider.when("/list", {
		templateUrl: "/views/tableView.html"
	});
	$routeProvider.when("/edit/:id", {
		templateUrl: "/views/editorView.html",
		controller: "editCtrl"
	});
	$routeProvider.when("/edit/:id/:data*", {
		templateUrl: "/views/editorView.html",
		controller: "editCtrl"
	});
	$routeProvider.when("/create", {
		templateUrl: "/views/editorView.html",
		controller: "editCtrl"
	});
	$routeProvider.otherwise({
		templateUrl: "/views/tableView.html",
		controller: "tableCtrl",
		resolve: {
			data: function (domainsResource) {
				return domainsResource.query();
			}
		}
	});
})
.controller("defaultCtrl", function ($scope, $location, domainsResource) {
	$scope.data = {};

	$scope.deleteDomain = function (domain) {
		domain.$delete().then(function () {
			$scope.data.domains.splice($scope.data.domains.indexOf(domain), 1);
		});
		$location.path("/list");
	}

	$scope.createDomain = function (domain) {
		new domainsResource(domain).$create().then(function (newDomain) {
			$scope.data.domains.push(newDomain);
			$location.path("/list");
		});
	}

})
.controller("tableCtrl", function ($scope, $location, $route, data) {
	$scope.data.products = data;

	$scope.refreshDomains = function () {
		$route.reload();
	}
})
.controller("editCtrl", function ($scope, $routeParams, $location) {

	$scope.currentDomain = null;

	if ($location.path().indexOf("/edit/") == 0) {
		var id = $routeParams["id"];
		for (var i = 0; i < $scope.data.domains.length; i++) {
			if ($scope.data.domains[i].id == id) {
				$scope.currentDomain = $scope.data.domains[i];
				break;
			}
		}
	}

	$scope.cancelEdit = function () {
		// if ($scope.currentDomain && $scope.currentDomain.$get) {
		// 	$scope.currentDomain.$get();
		// }
		$scope.currentDomain = {};
		$location.path("/list");
	}

	$scope.updateDomain = function (domain) {
		domain.$save();
		$location.path("/list");
	}

	$scope.saveEdit = function (domain) {
		if (angular.isDefined(domain.id)) {
			$scope.updateDomain(domain);
		} else {
			$scope.createDomain(domain);
		}
		$scope.currentDomain = {};
	}
});