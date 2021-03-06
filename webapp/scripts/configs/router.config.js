(function() {'use strict';
    /**
     * @ngdoc overview
     * @name cmsWebApp.overview:RouteConfig
     * @description
     * Configured/setup all routes of application. Using ui router for routing the application and
     * $stateProvider with all states are added here.
     */
    angular.module('cmsWebApp').config(RouteConfig);
    RouteConfig.$inject = ['$stateProvider', '$urlRouterProvider'];
    function RouteConfig($stateProvider, $urlRouterProvider) {
        // For any unmatched url, redirect to /state1
        $urlRouterProvider.otherwise("/login");
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
            resolve : {
                routeResolvedDashboardProjectListView : dashboardProjectList
            },            
            data : {
                roles : ['User']
            }
        }).state('projects', {
            url : "/projects",
            templateUrl : "views/commonMainWithNav.html",
            controller : 'ManageProjectController',
            controllerAs : 'projects',
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
        })
        .state('projectedit', {
            url : "/projects/projectedit?uri",
            templateUrl : "views/projectedit.html",
            controller : 'EditProjectController',
            controllerAs : 'project',
            resolve : {
                routeResolvedProjectEdit : projectVeiw,
                getProjectMasterDataProjectState : ['CommonService', function(CommonService){
                    return CommonService.getDictionary('project-status');
                }],
                getProjectMasterDataSubjects : ['CommonService', function(CommonService){
                    return CommonService.getDictionary('subject-heading');
                }]
            },
            data : {
                roles : ['User']
            }
       }) 
         .state('contentview', {
            url : "/content/contentview?uri",
            templateUrl : "views/contentview.html",
            controller : 'ViewContentController',
            controllerAs : 'content',
            resolve : {
                routeResolvedContentView : contentVeiw
            },
            data : {
                roles : ['User']
            }
       })
       .state('contentedit', {
            url : "/content/contentedit?uri",
            templateUrl : "views/contentedit.html",
            controller : 'EditContentController',
            controllerAs : 'content',
            resolve : {
                routeResolvedContentEdit : contentVeiw,
                getContentSourceResolve : ['CommonService', function(CommonService){
                    return CommonService.getDictionary('Source');
                }],
                getContentPublisherResolve : ['CommonService', function(CommonService){
                    return CommonService.getDictionary('Publisher');
                }],
                getContentStateResolve : ['CommonService', function(CommonService){
                    return CommonService.getDictionary('version-state');
                }],
                getContentSubjectsResolve : ['CommonService', function(CommonService){
                    return CommonService.getDictionary('subject-heading');
                }]
            },
            data : {
                roles : ['User']
            }
       }) 
        .state('content', {
            url : "/content",
            templateUrl : "views/commonMainWithNav.html",
            controller : 'ManageContentController',
            controllerAs : 'content',
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
        })
        .state('search', {
            url : "/search?searchType&searchText&facet",
            /*params : {
                searchType : 'all',
                searchText : ''
            },*/
            templateUrl : "views/search.html",
            controller : 'SearchController',
            controllerAs : 'search',
            data : {
                roles : ['User']
            }
        });

        /**
         * @ngdoc service
         * @name cmsWebApp.service:dashboardProjectList
         * @description
         * Get list of projects created by user
         * @returns {Object} promise with get projects list
         */
        dashboardProjectList.$inject = ['SearchService', 'CommonService'];
        function dashboardProjectList(SearchService, CommonService) {
            var username = CommonService.getItems('username');
            return SearchService.searchData('project', '', 1, 10, 'Newest');
            //return ManageProjectsService.getProjects();
        }

        /**
         * @ngdoc service
         * @name cmsWebApp.service:projectVeiw
         * @description
         * Resolved method to 'projectview' state. It call the viewproject method to get the project details.
         * @return {Object} promise with project details.
         */
        projectVeiw.$inject = ['$stateParams', 'ManageProjectsService', '$log'];
        function projectVeiw($stateParams, ManageProjectsService, $log) {
            $log.debug('projectVeiw' + $stateParams.uri);
            return ManageProjectsService.viewProject($stateParams.uri);
        }

         /**
         * @ngdoc service
         * @name cmsWebApp.service:contentVeiw
         * @description
         * Resolved method to 'contentVeiw' state. It call the viewcontent method to get the project details.
         * @return {Object} promise with project details.
         */
       contentVeiw.$inject = ['$stateParams', 'ManageContentService', '$log'];
        function contentVeiw($stateParams, ManageContentService, $log) {
            $log.debug('contentVeiw' + $stateParams.uri);
            return ManageContentService.viewContent($stateParams.uri);
        }
        
    }

})();
