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
    $urlRouterProvider.otherwise("/dashboard");
    //
    // Now set up the states
    $stateProvider.state('login', {
        url : "/login",
        templateUrl : "views/login.html",
        controller : 'LoginController',
        controllerAs : 'auth'
    })//Dashboard
    .state('dashboard', {
        url : "/dashboard",
        templateUrl : "views/commonMainWithNav.html",
        controller : 'DashboardController',
        controllerAs : 'dashboard',
        data : {
            roles : ['User']
        }
    })
    .state('projects', {
        url : "/projects",
        templateUrl : "views/commonMainWithNav.html",
        controller : 'ManageProjectController',
        controllerAs : 'projects',
        resolve : {
            routeResolvedProjectList : projectList
        },
        data : {
            roles : ['User']
        }
        
    })
    .state('projectview', {
        url : "/projects/projectview?uri",
        templateUrl : "views/projectview.html",
        controller : 'ViewProjectController',
        controllerAs : 'project',
        resolve : {
            routeResolvedProjectView : projectVeiw
        },
        data : {
            roles : ['User']
        }
    })
    .state('success', {
        url : "/success?type&status&name&id",
        templateUrl : "views/success-view.html",
        controller : 'SuccessStatusController',
        controllerAs : 'ss',
        data : {
            roles : ['User']
        }
    }); 
    projectList.$inject = ['ManageProjectsService'];
    //TODO doc
    function projectList (ManageProjectsService) {
        return ManageProjectsService.getProjects();
    }
    
    projectVeiw.$inject = ['$stateParams', 'ManageProjectsService', '$log'];
    //TODO doc
    function projectVeiw ($stateParams, ManageProjectsService, $log) {
        $log.debug('projectVeiw'+$stateParams.uri);
        return ManageProjectsService.viewProject($stateParams.uri);
    }
}]);

// Attaches event listeners
angular.module('cmsWebApp').directive('customFocus', [function () {
    var FOCUS_CLASS = "custom-focused"; //Toggle a class and style that!
    return {
        restrict: 'A', //Angular will only match the directive against attribute names
        require: 'ngModel',
        link: function (scope, element, attrs, ctrl) {
            ctrl.$focused = false;

            element.bind('focus', function (evt) {
                element.addClass(FOCUS_CLASS);
                scope.$apply(function () { ctrl.$focused = true; });

            }).bind('blur', function (evt) {
                element.removeClass(FOCUS_CLASS);
                scope.$apply(function () { ctrl.$focused = false; });
            });
        }
    };
}]);