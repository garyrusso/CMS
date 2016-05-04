'use strict';
/**
 * Main module of the application.
 * Declaration main module.
 * Name of module: cmsWebApp
 */
angular.module('cmsWebApp', [
    'ui.router', 
    'ui.bootstrap',
    'ngTable'
]).config(['$stateProvider', '$urlRouterProvider',
function($stateProvider, $urlRouterProvider) {
    //
    // For any unmatched url, redirect to /state1
    $urlRouterProvider.otherwise("/login");
    //
    // Now set up the states
    $stateProvider.state('login', {
        url : "/login",
        templateUrl : "views/login.html",
        controller : 'AuthenticationController',
        controllerAs : 'auth'
    })//Dashboard
    .state('dashboard', {
        url : "/dashboard",
        templateUrl : "views/commonMainWithNav.html",
        controller : 'DashboardController',
        controllerAs : 'dashboard'
    })
    .state('projects', {
        url : "/projects",
        templateUrl : "views/commonMainWithNav.html",
        controller : 'ManageProjectController',
        controllerAs : 'projects'
    })
    .state('projectview', {
        url : "/projectview",
        templateUrl : "views/projectview.html",
        controller : 'ManageProjectController',
        controllerAs : 'projects'
    }); 
}]).run(['$rootScope', '$state', '$stateParams',
function($rootScope, $state, $stateParams) {

    // It's very handy to add references to $state and $stateParams to the $rootScope
    // so that you can access them from any scope within your applications.For example,
    // <li ng-class="{ active: $state.includes('contacts.list') }"> will set the <li>
    // to active whenever 'contacts.list' or one of its decendents is active.
    $rootScope.$state = $state;
    $rootScope.$stateParams = $stateParams;
    
    $rootScope.$on('rootScopeCreateProjectHeaderOnEvent', rootScopeCreateProjectHeaderOnEvent);
    
    
    function rootScopeCreateProjectHeaderOnEvent () {
        $rootScope.$broadcast('createProjectHeaderOnEvent',{});
    }
}]);
