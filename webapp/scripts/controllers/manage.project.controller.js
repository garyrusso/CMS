/**
 * Controller Name: ManageProjectController
 * Desc: ManageProjectController hosts all project related functionalities including create, update, delete and enlisting of projects and project contents.
 *
 *  */
(function() {"use strict";
    angular.module('cmsWebApp').controller('ManageProjectController', ManageProjectController);

    /*Inject angular services to controller*/
    ManageProjectController.$inject = ['$scope', 'NgTableParams', '$uibModal', '_', 'CommonService'];

    /*Function ManageProjectController*/
    function ManageProjectController($scope, NgTableParams, $uibModal, _, CommonService) {
        var projects = this;

        projects.data = {
            "total" : 27,
            "start" : 1,
            "page-length" : 10,
            "results" : [{
                "Title" : "Hockenbury 5e-1",
                "uri" : "/mydocuments/project1.xml",
                "path" : "fn:doc(\"/mydocuments/project1.xml\")",
                "href" : "/v1/documents?uri=%2Fmydocuments%2Fproject1.xml",
                "mimetype" : "application/xml",
                "format" : "xml",
                "dateLastModified" : "2015-04-15 13:30",
                "username" : "bcross",
                "fullName" : "Brian Cross"
            }, {
                "Title" : "Hockenbury 5e-2",
                "uri" : "/mydocuments/project2.xml",
                "path" : "fn:doc(\"/mydocuments/project2.xml\")",
                "href" : "/v1/documents?uri=%2Fmydocuments%2Fproject2.xml",
                "mimetype" : "application/xml",
                "format" : "xml",
                "dateLastModified" : "2015-04-15 13:30",
                "username" : "bcross",
                "fullName" : "Brian Cross"
            }, {
                "Title" : "Hockenbury 5e-3",
                "uri" : "/mydocuments/project3.xml",
                "path" : "fn:doc(\"/mydocuments/project3.xml\")",
                "href" : "/v1/documents?uri=%2Fmydocuments%2Fproject3.xml",
                "mimetype" : "application/xml",
                "format" : "xml",
                "dateLastModified" : "2015-04-15 13:30",
                "username" : "bcross",
                "fullName" : "Brian Cross"
            }, {
                "Title" : "Hockenbury 5e-4",
                "uri" : "/mydocuments/project4.xml",
                "path" : "fn:doc(\"/mydocuments/project4.xml\")",
                "href" : "/v1/documents?uri=%2Fmydocuments%2Fproject4.xml",
                "mimetype" : "application/xml",
                "format" : "xml",
                "dateLastModified" : "2015-04-15 13:30",
                "username" : "bcross",
                "fullName" : "Brian Cross"
            }, {
                "Title" : "Hockenbury 5e-5",
                "uri" : "/mydocuments/project4.xml",
                "path" : "fn:doc(\"/mydocuments/project4.xml\")",
                "href" : "/v1/documents?uri=%2Fmydocuments%2Fproject4.xml",
                "mimetype" : "application/xml",
                "format" : "xml",
                "dateLastModified" : "2015-04-15 13:30",
                "username" : "bcross",
                "fullName" : "Brian Cross"
            }, {
                "Title" : "Hockenbury 5e-6",
                "uri" : "/mydocuments/project4.xml",
                "path" : "fn:doc(\"/mydocuments/project4.xml\")",
                "href" : "/v1/documents?uri=%2Fmydocuments%2Fproject4.xml",
                "mimetype" : "application/xml",
                "format" : "xml",
                "dateLastModified" : "2015-04-15 13:30",
                "username" : "bcross",
                "fullName" : "Brian Cross"
            }, {
                "Title" : "Hockenbury 5e-7",
                "uri" : "/mydocuments/project4.xml",
                "path" : "fn:doc(\"/mydocuments/project4.xml\")",
                "href" : "/v1/documents?uri=%2Fmydocuments%2Fproject4.xml",
                "mimetype" : "application/xml",
                "format" : "xml",
                "dateLastModified" : "2015-04-15 13:30",
                "username" : "bcross",
                "fullName" : "Brian Cross"
            }, {
                "Title" : "Hockenbury 5e-8",
                "uri" : "/mydocuments/project4.xml",
                "path" : "fn:doc(\"/mydocuments/project4.xml\")",
                "href" : "/v1/documents?uri=%2Fmydocuments%2Fproject4.xml",
                "mimetype" : "application/xml",
                "format" : "xml",
                "dateLastModified" : "2015-04-15 13:30",
                "username" : "bcross",
                "fullName" : "Brian Cross"
            }, {
                "Title" : "Hockenbury 5e-9",
                "uri" : "/mydocuments/project4.xml",
                "path" : "fn:doc(\"/mydocuments/project4.xml\")",
                "href" : "/v1/documents?uri=%2Fmydocuments%2Fproject4.xml",
                "mimetype" : "application/xml",
                "format" : "xml",
                "dateLastModified" : "2015-04-15 13:30",
                "username" : "bcross",
                "fullName" : "Brian Cross"
            }, {
                "Title" : "Hockenbury 5e-10",
                "uri" : "/mydocuments/project4.xml",
                "path" : "fn:doc(\"/mydocuments/project4.xml\")",
                "href" : "/v1/documents?uri=%2Fmydocuments%2Fproject4.xml",
                "mimetype" : "application/xml",
                "format" : "xml",
                "dateLastModified" : "2015-04-15 13:30",
                "username" : "bcross",
                "fullName" : "Brian Cross"
            }],
            "facets" : {
                "projectState" : {
                    "type" : "xs:string",
                    "facetValues" : [{
                        "name" : "Active",
                        "count" : 12,
                        "value" : "Active"
                    }, {
                        "name" : "Completed",
                        "count" : 1,
                        "value" : "Completed"
                    }]
                },
                "Title" : {
                    "type" : "xs:string",
                    "facetValues" : [{
                        "name" : "Hockenbury 5e",
                        "count" : 4,
                        "value" : "Hockenbury 5e"
                    }, {
                        "name" : "Hockenbury 5e-1",
                        "count" : 1,
                        "value" : "Hockenbury 5e-1"
                    }, {
                        "name" : "Hockenbury 5e-2",
                        "count" : 1,
                        "value" : "Hockenbury 5e-2"
                    }, {
                        "name" : "Hockenbury 5e-3",
                        "count" : 1,
                        "value" : "Hockenbury 5e-3"
                    }, {
                        "name" : "Hockenbury 5e-4",
                        "count" : 1,
                        "value" : "Hockenbury 5e-4"
                    }, {
                        "name" : "Myers 11e EPUB3",
                        "count" : 1,
                        "value" : "Myers 11e EPUB3"
                    }]
                },
                "Subjects" : {
                    "type" : "xs:string",
                    "facetValues" : [{
                        "name" : "Psychology",
                        "count" : 13,
                        "value" : "Psychology"
                    }]
                },
                "query" : {
                    "and-query" : [{
                        "element-range-query" : [{
                            "operator" : "=",
                            "element" : "_1:subjectHeading",
                            "value" : [{
                                "type" : "xs:string",
                                "_value" : "Psychology"
                            }],
                            "option" : "collation=http://marklogic.com/collation/"
                        }],
                        "annotation" : [{
                            "operator-ref" : "sort",
                            "state-ref" : "relevance"
                        }]
                    }]
                }
            }
        };

        projects.facets = _.chain(projects.data.facets).omit('query').map(function(value, key) {
            return {
                facetTitle : key,
                facetArray : value.facetValues
            };
        }).value();

        projects.listView = true;

        /* function to toggle list, grid views */
        projects.toggleView = toggleView;

        //TODO: move to Commonservice
        projects.createProject = projectsCreateProject;
        //TODO: move to Commonservice
        projects.editProject = projetcsEditProject;

        projects.showAllFacetsItems = CommonService.showAllFacetsItems;

        projects.tableParams = new NgTableParams({
            count : 10
        }, {
            /*counts:[],*/
            data : projects.data.results/*.slice(0,10)*/
        });

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
            $scope.$emit('rootScopeCreateProjectHeaderOnEvent', {});
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

    }

})();
