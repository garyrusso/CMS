/**
 * Controller Name: ManageProjectController
 * Desc: ManageProjectController hosts all project related functionalities including create, update, delete and enlisting of projects and project contents.
 *
 *  */
(function() {"use strict";
    angular.module('cmsWebApp').controller('ManageProjectController', ManageProjectController);

    /*Inject angular services to controller*/
    ManageProjectController.$inject = ['$scope', 'NgTableParams', '$uibModal'];

    /*Function ManageProjectController*/
    function ManageProjectController($scope, NgTableParams, $uibModal) {
        var projects = this;

        var items = [{
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
            "dateLastModified" : "2015-04-16 13:30",
            "username" : "bcross1",
            "fullName" : "Brian Cross1"
        }, {
            "Title" : "Hockenbury 5e-3",
            "uri" : "/mydocuments/project3.xml",
            "path" : "fn:doc(\"/mydocuments/project3.xml\")",
            "href" : "/v1/documents?uri=%2Fmydocuments%2Fproject3.xml",
            "mimetype" : "application/xml",
            "format" : "xml",
            "dateLastModified" : "2015-04-17 13:30",
            "username" : "bcross2",
            "fullName" : "Brian Cross2"
        }, {
            "Title" : "Hockenbury 5e-4",
            "uri" : "/mydocuments/project4.xml",
            "path" : "fn:doc(\"/mydocuments/project4.xml\")",
            "href" : "/v1/documents?uri=%2Fmydocuments%2Fproject4.xml",
            "mimetype" : "application/xml",
            "format" : "xml",
            "dateLastModified" : "2015-04-18 13:30",
            "username" : "bcross3",
            "fullName" : "Brian Cross3"
        }, {
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
            "dateLastModified" : "2015-04-16 13:30",
            "username" : "bcross1",
            "fullName" : "Brian Cross1"
        }, {
            "Title" : "Hockenbury 5e-3",
            "uri" : "/mydocuments/project3.xml",
            "path" : "fn:doc(\"/mydocuments/project3.xml\")",
            "href" : "/v1/documents?uri=%2Fmydocuments%2Fproject3.xml",
            "mimetype" : "application/xml",
            "format" : "xml",
            "dateLastModified" : "2015-04-17 13:30",
            "username" : "bcross2",
            "fullName" : "Brian Cross2"
        }, {
            "Title" : "Hockenbury 5e-4",
            "uri" : "/mydocuments/project4.xml",
            "path" : "fn:doc(\"/mydocuments/project4.xml\")",
            "href" : "/v1/documents?uri=%2Fmydocuments%2Fproject4.xml",
            "mimetype" : "application/xml",
            "format" : "xml",
            "dateLastModified" : "2015-04-18 13:30",
            "username" : "bcross3",
            "fullName" : "Brian Cross3"
        }, {
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
            "dateLastModified" : "2015-04-16 13:30",
            "username" : "bcross1",
            "fullName" : "Brian Cross1"
        }, {
            "Title" : "Hockenbury 5e-3",
            "uri" : "/mydocuments/project3.xml",
            "path" : "fn:doc(\"/mydocuments/project3.xml\")",
            "href" : "/v1/documents?uri=%2Fmydocuments%2Fproject3.xml",
            "mimetype" : "application/xml",
            "format" : "xml",
            "dateLastModified" : "2015-04-17 13:30",
            "username" : "bcross2",
            "fullName" : "Brian Cross2"
        }, {
            "Title" : "Hockenbury 5e-4",
            "uri" : "/mydocuments/project4.xml",
            "path" : "fn:doc(\"/mydocuments/project4.xml\")",
            "href" : "/v1/documents?uri=%2Fmydocuments%2Fproject4.xml",
            "mimetype" : "application/xml",
            "format" : "xml",
            "dateLastModified" : "2015-04-18 13:30",
            "username" : "bcross3",
            "fullName" : "Brian Cross3"
        }, {
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
            "dateLastModified" : "2015-04-16 13:30",
            "username" : "bcross1",
            "fullName" : "Brian Cross1"
        }, {
            "Title" : "Hockenbury 5e-3",
            "uri" : "/mydocuments/project3.xml",
            "path" : "fn:doc(\"/mydocuments/project3.xml\")",
            "href" : "/v1/documents?uri=%2Fmydocuments%2Fproject3.xml",
            "mimetype" : "application/xml",
            "format" : "xml",
            "dateLastModified" : "2015-04-17 13:30",
            "username" : "bcross2",
            "fullName" : "Brian Cross2"
        }, {
            "Title" : "Hockenbury 5e-4",
            "uri" : "/mydocuments/project4.xml",
            "path" : "fn:doc(\"/mydocuments/project4.xml\")",
            "href" : "/v1/documents?uri=%2Fmydocuments%2Fproject4.xml",
            "mimetype" : "application/xml",
            "format" : "xml",
            "dateLastModified" : "2015-04-18 13:30",
            "username" : "bcross3",
            "fullName" : "Brian Cross3"
        }];

        projects.listView = true;

        /* function to toggle list, grid views */
        projects.toggleView = toggleView;
        
        projects.createProject = projectsCreateProject;
        
        projects.editProject = projetcsEditProject;

        projects.tableParams = new NgTableParams({
            count : 10
        }, {
            /*counts:[],*/
            data : items/*.slice(0,10)*/
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
        function projectsCreateProject () {
            $scope.$emit('rootScopeCreateProjectHeaderOnEvent', {});
        }
        
        /*
         * Name: projetcsEditProject
         * Desc:
         * open Edit project modal set on header controller, so first emit event to rootscope & rootscope broadcast to header
         */
        function projetcsEditProject () {
            var modalInstance = $uibModal.open({
                templateUrl : 'views/modal-template.html',
                controller : 'ModalCreateEditProjectController',
                size : 'lg',
                resolve : {
                    items : function() {
                        return {
                            templateUrl: 'views/create-edit-project.html',
                            edit: true
                        };
                    }
                }
            });

            modalInstance.result.then(function(selectedItem) {
                $scope.selected = selectedItem;
            }, function() {
                
            });
        
        }
        
    }

})();
