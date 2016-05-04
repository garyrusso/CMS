/**
 * Controller Name: DashboardController
 * Desc: DashboardController have functionality related to landing page like create project, display top n project list etc...
 *
 *  */
(function() {
    "use strict";
    angular.module('cmsWebApp').controller('DashboardController', DashboardController);

    /*Inject angular services to controller*/
    DashboardController.$inject = ['$scope','NgTableParams'];

    /*Function DashboardController*/
    function DashboardController($scope, NgTableParams) {
        var dashboard = this;
        
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
        },{
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
        },{
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
        },{
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
        
        dashboard.createProject = dashboardCreateProject;
        
        dashboard.tableParams = new NgTableParams({
            count: 5
        }, {
            counts:[],
            data : items.slice(0,5)
        });
        
        /*
         * Name: dashboardCreateProject
         * Desc:
         * open create project modal set on header controller, so first emit event to rootscope & rootscope broadcast to header
         */
        function dashboardCreateProject () {
            $scope.$emit('rootScopeCreateProjectHeaderOnEvent', {});
        }
        
    }

})();
