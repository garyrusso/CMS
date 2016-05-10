/**
 * Controller Name: ManageProjectController
 * Desc: ManageProjectController hosts all project related functionalities including create, update, delete and enlisting of projects and project contents.
 *
 *  */
(function() {"use strict";
    angular.module('cmsWebApp').controller('ManageProjectController', ManageProjectController);

    /*Inject angular services to controller*/
    ManageProjectController.$inject = ['$scope', 'NgTableParams', '$uibModal', '_', '$log', 'CommonService', 'ManageProjectsService', 'routeResolvedProjectList'];

    /*Function ManageProjectController*/
    function ManageProjectController($scope, NgTableParams, $uibModal, _, $log, CommonService, ManageProjectsService, routeResolvedProjectList) {
        var projects = this;

        projects.data = routeResolvedProjectList;

        if (projects.data && projects.data.results && _.isArray(projects.data.results)) {
            projects.data.results = projects.data.results.slice(0, 10);
        }

        if (projects.data && projects.data.facets) {
            projects.facets = _.chain(projects.data.facets).omit('query').map(function(value, key) {
                return {
                    facetTitle : key,
                    facetArray : value.facetValues
                };
            }).value();
        }

        projects.listView = true;

        /* function to toggle list, grid views */
        projects.toggleView = toggleView;

        //TODO: move to Commonservice
        projects.createProject = projectsCreateProject;
        
        //TODO check & remove.
        projects.refreshData = refreshData;

        projects.showAllFacetsItems = CommonService.showAllFacetsItems;

        projects.tableParams = new NgTableParams({
            count : 10
        }, {
            /*counts:[],*/
            data : projects.data.results/*.slice(0,10)*/
        });
        
        $scope.$on('createProjectEvent', createProjectEvent);
        
        /**
         * @name createProjectEvent
         * @description
         * Update the projects table list.
         */
        function createProjectEvent () {
            projects.refreshData();
        }
        
        function refreshData () {
            ManageProjectsService.getProjects().then(function(response) {
                    projects.data = response;
                    projects.tableParams.settings({
                        data : projects.data.results.slice(0, 10)
                    });
                });
        }

        /*
         * Name: toggleView
         * Params: (boolean)viewType - listView is true or false.
         * Desc:
         * Switch view from list to grid. if listView is set true then projects displayed in table format else in tile view.
         */
        function toggleView(viewType) {
            projects.listView = viewType;
        }

        /**
         * @name projectsCreateProject
         * @description
         * open create project modal set on header controller, so first emit event to rootscope & rootscope broadcast to header
         */
        function projectsCreateProject() {
            //$scope.$emit('rootScopeCreateProjectHeaderOnEvent', {});
            ManageProjectsService.openProjectModal(false).then(function() {
                //projects.refreshData();
                $log.debug('project updated with new one');
            });
        }

    }

})();
