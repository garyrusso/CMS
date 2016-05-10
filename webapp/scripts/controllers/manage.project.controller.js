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
        //TODO: move to Commonservice
        projects.editProject = projetcsEditProject;

        //TODO: move to Commonservice
        projects.deleteProject = projetcsdeleteProject;
        
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

        /*
         * Name: projectsCreateProject
         * Desc:
         * open create project modal set on header controller, so first emit event to rootscope & rootscope broadcast to header
         */
        function projectsCreateProject() {
            //$scope.$emit('rootScopeCreateProjectHeaderOnEvent', {});
            ManageProjectsService.openProjectModal(false).then(function() {
                //projects.refreshData();
                $log.debug('project updated with new one');
            });
        }

        /*
         * Name: projetcsEditProject
         * Desc:
         * open Edit project modal set on header controller, so first emit event to rootscope & rootscope broadcast to header
         */
        function projetcsEditProject() {
            var modalInstance = $uibModal.open({
                templateUrl : 'views/modal-template.html',
                controller : 'ModalCreateEditProjectController',
                size : 'lg',
                resolve : {
                    items : function() {
                        return {
                            templateUrl : 'views/modal-create-edit-project.html',
                            edit : true
                        };
                    }
                }
            });

            modalInstance.result.then(function(selectedItem) {
                $scope.selected = selectedItem;
            }, function() {

            });

        }/*end of projetcsEditProject*/

        //TODO: add desc & change controller
        function projetcsdeleteProject() {
            var modalInstance = $uibModal.open({
                templateUrl : 'views/modal-template.html',
                controller : 'ModalCreateEditProjectController',
                size : 'md',
                resolve : {
                    items : function() {
                        return {
                            templateUrl : 'views/modal-delete-project.html',
                            edit : true
                        };
                    }
                }
            });

            modalInstance.result.then(function(selectedItem) {
                $scope.selected = selectedItem;
            }, function() {

            });
        }


        $scope.projectDetails = {
            "systemUID" : "d41d8cd98f00b204e9800998ecf8427e",
            "uri" : "/projects/project1.xml",
            "path" : "fn:doc(\"/projects/project1.xml\")",
            "href" : "/v1/documents?uri=%2Fprojects%2Fproject1.xml",
            "mimetype" : "application/xml",
            "format" : "xml",
            "dateCreated" : "2015-04-15 13:30",
            "dateLastModified" : "2015-04-15 13:30",
            "username" : "bcross",
            "createdBy" : "Brian Cross",
            "modifiedBy" : "Brian Cross",
            "Title" : "Hockenbury 5e-1",
            "description" : "Project description",
            "projectState" : "Active",
            "subjectHeadings" : [{
                "subjectHeading" : "Psychology"
            }, {
                "subjectHeading" : "Biology"
            }],
            "subjectKeywords" : [{
                "subjectKeyword" : "Psychology"
            }, {
                "subjectKeyword" : "Biology"
            }],
            "content" : [{
                "systemUID" : "d41d8cd98f00b204e9800998ecf8427e",
                "uri" : "/documents/content1.xml",
                "path" : "fn:doc(\"/documents/content1.xml\")",
                "href" : "/v1/documents?uri=%2Fdocuments%2Fcontent1.xml",
                "mimetype" : "application/xml",
                "format" : "xml",
                "dateCreated" : "2015-04-15 13:30",
                "dateLastModified" : "2015-04-15 13:30",
                "username" : "bcross",
                "createdBy" : "Brian Cross",
                "modifiedBy" : "Brian Cross",
                "Title" : "Content-1"
            }, {
                "systemUID" : "d41d8cd98f00b204e9800998ecf8427e",
                "uri" : "/documents/content2.xml",
                "path" : "fn:doc(\"/documents/content2.xml\")",
                "href" : "/v1/documents?uri=%2Fdocuments%2Fcontent2.xml",
                "mimetype" : "application/xml",
                "format" : "xml",
                "dateCreated" : "2015-04-15 13:30",
                "dateLastModified" : "2015-04-15 13:30",
                "username" : "bcross",
                "createdBy" : "Brian Cross",
                "modifiedBy" : "Brian Cross",
                "Title" : "Content-2"
            }]
        }

    }

})();
