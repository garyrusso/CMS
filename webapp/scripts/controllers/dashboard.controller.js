(function() {"use strict";
    /**
     * @ngdoc controller
     * @name cmsWebApp.controller:DashboardController
     * @description 
     * DashboardController have functionality related to landing page like create project, display top n project list etc...
     */
    angular.module('cmsWebApp').controller('DashboardController', DashboardController);

    /*Inject angular services to controller*/
    DashboardController.$inject = ['$scope', 'NgTableParams', 'CommonService', 'ManageProjectsService', '$log', 'routeResolvedDashboardProjectListView'];

    /*Function DashboardController*/
    function DashboardController($scope, NgTableParams, CommonService, ManageProjectsService, $log, routeResolvedDashboardProjectListView) {
        var dashboard = this;

        dashboard.data = routeResolvedDashboardProjectListView;    
      
        dashboard.facets = CommonService.formatFacets(dashboard.data.facets);

        dashboard.showAllFacetsItems = CommonService.showAllFacetsItems;

        dashboard.createProject = dashboardCreateProject;

        dashboard.tableParams = new NgTableParams({
            count : 5
        }, {
            counts : [],
            data : dashboard.data.results.slice(0, 5)
        });

        /**
         * @ngdoc method
         * @name dashboardCreateProject
         * @methodOf cmsWebApp.controller:DashboardController
         * @description
         * open create project modal
         */
        function dashboardCreateProject() {
            ManageProjectsService.openProjectModal(false).then(function() {
                $log.debug('project created - header');
            });
        }

    }

})();
