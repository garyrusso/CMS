(function() {"use strict";
    /**
     * @ngdoc controller
     * @name cmsWebApp.controller:ManageProjectController
     * @description 
     * ManageProjectController controller for project page 
     */
    angular.module('cmsWebApp').controller('ManageProjectController', ManageProjectController);

    /*Inject angular services to controller*/
    ManageProjectController.$inject = ['$scope', 'NgTableParams', '$uibModal', '_', '$log', '$q', 'CommonService', 'ManageProjectsService', 'SearchService'];

    /*Function ManageProjectController*/
    function ManageProjectController($scope, NgTableParams, $uibModal, _, $log, $q, CommonService, ManageProjectsService, SearchService) {
        var projects = this;

        projects.facets = {};

        projects.listView = true;

        /* function to toggle list, grid views */
        projects.toggleView = toggleView;

        //create project button click function.
        projects.createProject = projectsCreateProject;

        projects.showAllFacetsItems = CommonService.showAllFacetsItems;

        //ng-table col configuration
        projects.cols = [{
            field : "title",
            title : "Title",
            sortable : false,//"title"
            sortDirection : "desc"
        }, {
            field : "createdBy",
            title : "Owner",
            sortable: false,//"createdBy"
            sortDirection : "desc"
        }, {
            field: "created",
            title : "Date Created",
            sortable: false,//"modified"
            sortDirection : "asc"
        }];
        projects.sortables = _.indexBy(projects.cols, "field");
        
        projects.tableParams = new NgTableParams({
            count : 10
        }, {
            /*counts:[],*/
            getData: function (params) {
                $log.debug('ManageProjectController - params', params);
                var defer = $q.defer();
                $scope.setLoading(true);
                var pageDetails = params.url(), orderBy = params.orderBy()?params.orderBy()[0]:'';
                //SearchService.searchData('project', '', pageDetails.page, pageDetails.count, orderBy).then(function(response){
                ManageProjectsService.getProjects().then(function (response) {
                    $scope.setLoading(false);
                    params.total(response.count);
                    projects.facets = CommonService.formatFacets(response.facets);
                    defer.resolve(response.result);
                }, function(){
                    defer.resolve([]);
                });
                return defer.promise;
            }
        });

        /**
         * @ngdoc method
         * @name toggleView
         * @methodOf cmsWebApp.controller:ManageProjectController
         * @param {Boolean} viewType listView is true or false.
         * @description
         * Switch view from list to grid. if listView is set true then projects displayed in table format else in tile view.
         */
        function toggleView(viewType) {
            projects.listView = viewType;
        }

        /**
         * @ngdoc method
         * @name projectsCreateProject
         * @methodOf cmsWebApp.controller:ManageProjectController
         * @description
         * open create project modal set on header controller, so first emit event to rootscope & rootscope broadcast to header
         */
        function projectsCreateProject() {
            ManageProjectsService.openProjectModal(false).then(function() {
                $log.debug('project updated with new one');
            });
        }

    }

})();
