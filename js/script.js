var evamApp = angular.module('evamApp', ['ngRoute', 'ngTouch', 'ngAnimate', 'ui.bootstrap']);


evamApp.directive("datatable", function() {
	return {
	  templateUrl : "../dataTable.html"
	};
  });

const fields = [
	{
		'required': true,
		'name': 'Ad',
		'dataType': 'STRING'
	},
	{
		'required': true,
		'name': 'Soyad',
		'dataType': 'STRING'
	},
	{
		'required': false,
		'name': 'Yaş',
		'dataType': 'NUMBER'
	}
];

evamApp.config(function ($routeProvider) {
	$routeProvider
		.when('/', {
			templateUrl: 'list.html',
			controller: 'mainController'
		})
		.when('/forms/:formName', {
			templateUrl: 'detail.html',
			controller: 'formDetailController'
		})
});

evamApp.controller('mainController', function ($scope, $uibModal) {
	$scope.data = loadState() ? loadState() : saveState([
		{
			'name': 'Test form',
			'description': 'Uye bilgi formu',
			'createdAt': '2017-01-08',
			'fields': fields
		}
	]);


	$scope.showPopup = function () {
		data = $scope.data;
		$scope.modalInstance = $uibModal.open({
			ariaLabelledBy: 'modal-title',
			ariaDescribedBy: 'modal-body',
			templateUrl: 'modal.html',
			controller: 'ModelHandlerController',
			controllerAs: '$ctrl',
			size: 'lg',
			resolve: {
				data: function () {
					return data;
				}
			}
		});
	}


});

evamApp.controller("ModelHandlerController", function ($scope, $uibModalInstance) {

	$scope.cancelModal = function () {
		$uibModalInstance.dismiss('close');
	}
	$scope.ok = function () {
		$uibModalInstance.close('save');
		console.log($scope.name)
		console.log($scope.description)
		console.log($scope.date)

		data.push({
			'name': $scope.name,
			'description': $scope.description,
			'createdAt': moment($scope.date).format('YYYY-MM-DD'),
			'fields': fields
		})
		saveState(data);
	}


});

evamApp.controller('formDetailController', function ($scope, $routeParams) {
	$scope.dataByName = loadState().filter(function (e) {
			return e.name == $routeParams.formName;
	});
	$scope.typeInput = function(params) {
		return params == 'STRING' ? 'text' : 'number';
	}
	
});

function loadState() {
	try {
		const serializedState = localStorage.getItem('state');
		if (serializedState === null)
			return undefined;
		return JSON.parse(serializedState);
	} catch (error) {
		return undefined;
	}
}

function saveState(state) {
	try {
		const serializedState = JSON.stringify(state)
		localStorage.setItem('state', serializedState);
	} catch (error) {
		return undefined;
	}
}



