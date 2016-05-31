/**
 * Controller Name: ManageProjectController
 * Desc: ManageProjectController hosts all project related functionalities including create, update, delete and enlisting of projects and project contents.
 *
 *  */
(function() {"use strict";
    angular.module('cmsWebApp').controller('ManageProjectController', ManageProjectController);

    /*Inject angular services to controller*/
    ManageProjectController.$inject = ['$scope', 'NgTableParams', '$uibModal', '_', '$log', 'CommonService', 'ManageProjectsService', 'SearchService'];

    /*Function ManageProjectController*/
    function ManageProjectController($scope, NgTableParams, $uibModal, _, $log, CommonService, ManageProjectsService, SearchService) {
        var projects = this;

        projects.facets = {};

        projects.listView = true;

        /* function to toggle list, grid views */
        projects.toggleView = toggleView;

        //TODO: move to Commonservice
        projects.createProject = projectsCreateProject;

        //TODO check & remove.
        projects.refreshData = refreshData;

        projects.showAllFacetsItems = CommonService.showAllFacetsItems;

        //ng-table col configuration
        projects.cols = [{
            field : "Title",
            title : "Title",
            sortable : "Title",
            sortDirection : "desc"
        }, {
            field : "username",
            title : "Owner",
            sortable : "username",
            sortDirection : "desc"
        }, {
            field : "dateLastModified",
            title : "Date Modified",
            sortable : "dateLastModified",
            sortDirection : "asc"
        }];
        projects.sortables = _.indexBy(projects.cols, "field");
        
        projects.tableParams = new NgTableParams({
            count : 10
        }, {
            /*counts:[],*/
            getData: function (params) {
                $log.debug('ManageProjectController - params', params);
                $scope.setLoading(true);
                var pageDetails = params.url(), orderBy = params.orderBy()?params.orderBy()[0]:'';
                return SearchService.searchData('project', '', pageDetails.page, pageDetails.count, orderBy).then(function(response){
                    $scope.setLoading(false);
                    params.total(response.total);
                    projects.facets = CommonService.formatFacets(response.facets);
                    return response.results;
                });
            }
        });

        $scope.$on('createProjectEvent', createProjectEvent);

        /**
         * @name createProjectEvent
         * @description
         * Update the projects table list.
         */
        function createProjectEvent() {
            projects.refreshData();
        }

        function refreshData() {
            projects.tableParams.reload();
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
                projects.refreshData();
                $log.debug('project updated with new one');
            });
        }

    }

})();
