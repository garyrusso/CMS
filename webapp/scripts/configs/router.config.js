(function() {'use strict';
    /**
     * @ngdoc config
     * @name cmsWebApp.config:RouteConfig
     * @description
     * Configured/setup all routes of application.
     */
    angular.module('cmsWebApp').config(RouteConfig);
    RouteConfig.$inject = ['$stateProvider', '$urlRouterProvider'];
    function RouteConfig($stateProvider, $urlRouterProvider) {
        // For any unmatched url, redirect to /state1
        $urlRouterProvider.otherwise("/dashboard");
        //
        // Now set up the state
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
        }).state('projects', {
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

        }).state('projectview', {
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
        }).state('success', {
            url : "/success?type&status&name&id",
            templateUrl : "views/success-view.html",
            controller : 'SuccessStatusController',
            controllerAs : 'ss',
            data : {
                roles : ['User']
            }
        })
        .state('search', {
            url : "/search",
            params : {
                searchType : 'all',
                searchText : ''
            },
            templateUrl : "views/search.html",
            controller : 'SearchController',
            controllerAs : 'search',
            data : {
                roles : ['User']
            }
        });

        /**
         * @ngdoc service
         * @name cmsWebApp.service:projectList
         * @description
         * Resolved method to 'projects' state. It call the getprojects method to get all projects list.
         * @return promise with get projects list
         */
        projectList.$inject = ['ManageProjectsService'];
        function projectList(ManageProjectsService) {
            return ManageProjectsService.getProjects();
        }

        /**
         * @ngdoc service
         * @name cmsWebApp.service:projectVeiw
         * @description
         * Resolved method to 'projectview' state. It call the viewproject method to get the project details.
         * @return promise with project details.
         */
        projectVeiw.$inject = ['$stateParams', 'ManageProjectsService', '$log'];
        function projectVeiw($stateParams, ManageProjectsService, $log) {
            $log.debug('projectVeiw' + $stateParams.uri);
            return ManageProjectsService.viewProject($stateParams.uri);
        }

    }

})();