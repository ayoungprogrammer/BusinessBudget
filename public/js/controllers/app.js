var app = angular.module('app',[
                                'app.directives',
                                'app.controllers',
                                'angularTreeview']);

app.config(['$routeProvider','$locationProvider',
	function($routeProvider,$locationProvider){
	$routeProvider.
	when('/',{
		templateUrl: 'view/budget',
		controller: 'ItemController'
	}).
	when('/budget/:id',{
		templateUrl: 'view/budget',
		controller: 'ItemController'
	}).
	when('/login',{
		templateUrl:'view/login',
		controller: 'LoginController'
	}).
	when('/admin',{
		templateUrl:'view/admin',
		controller: 'AdminController'
	}).
	when('/invalid',{
		templateUrl:'view/invalid',
		controller: 'InvalidController'
	}).
	otherwise({
		redirectTo: '/'
	});
	
	$locationProvider.html5Mode(true);
	
}]);
