/**
 * Controller Name: DashboardController
 * Desc: DashboardController have functionality related to landing page like create project, display top n project list etc...
 *
 *  */
(function() {"use strict";
    angular.module('cmsWebApp').controller('DashboardController', DashboardController);

    /*Inject angular services to controller*/
    DashboardController.$inject = ['$scope', 'NgTableParams', 'CommonService', 'ManageProjectsService', '$log'];

    /*Function DashboardController*/
    function DashboardController($scope, NgTableParams, CommonService, ManageProjectsService, $log) {
        var dashboard = this;

        dashboard.data = {
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
                "projectState" : {
                    "type" : "xs:string",
                    "facetValues" : [{
                        "name" : "Active",
                        "count" : 12,
                        "value" : "Active"
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
                "Keywords" : {
                    "type" : "xs:string",
                    "facetValues" : [{
                        "name" : "Keyword 1",
                        "count" : 8,
                        "value" : "Keyword 1"
                    }, {
                        "name" : "Keyword 2",
                        "count" : 13,
                        "value" : "Keyword 2"
                    }, {
                        "name" : "Keyword 3",
                        "count" : 23,
                        "value" : "Keyword 3"
                    }, {
                        "name" : "Keyword 4",
                        "count" : 35,
                        "value" : "Keyword 4"
                    }, {
                        "name" : "Keyword 5",
                        "count" : 12,
                        "value" : "Keyword 5"
                    }, {
                        "name" : "Keyword 6",
                        "count" : 7,
                        "value" : "Keyword 6"
                    }, {
                        "name" : "Keyword 7",
                        "count" : 25,
                        "value" : "Keyword 7"
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

        dashboard.facets = _.chain(dashboard.data.facets).omit('query').map(function(value, key) {
            return {
                facetTitle : key,
                facetArray : value.facetValues
            };
        }).value();

        dashboard.showAllFacetsItems = CommonService.showAllFacetsItems;

        dashboard.createProject = dashboardCreateProject;

        dashboard.tableParams = new NgTableParams({
            count : 5
        }, {
            counts : [],
            data : dashboard.data.results.slice(0, 5)
        });

        /**
         * @name dashboardCreateProject
         * @description
         * open create project modal
         */
        function dashboardCreateProject() {
            ManageProjectsService.openProjectModal(false).then(function() {
                $log.debug('project created - header');
                //$scope.$emit('onCreateProjectHeader', {});
            });
        }

    }

})();
