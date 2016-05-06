'use strict';
/**
 * Main module of the application.
 * Declaration main module.
 * Name of module: cmsWebApp
 */
angular.module('cmsWebApp', [
    'ui.router', 
    'ui.bootstrap',
    'cms-underscore',
    'ngTable'
]).config(['$stateProvider', '$urlRouterProvider',
function($stateProvider, $urlRouterProvider) {
    //TODO Move route config to configs folder
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
    })
    .state('success', {
        url : "/success?type&status&name&id",
        templateUrl : "views/success-view.html",
        controller : 'SuccessStatusController',
        controllerAs : 'ss'
    }); 
}]);
