(function() {"use strict";
    /**
     * ngdoc controller
     * @name cmsWebApp.controller:ModalUploadContentController
     * @description
     * ModalUploadContentController to manage upload Content.
     */
    angular.module('cmsWebApp').controller('ModalUploadContentController', ModalUploadContentController);

    /*Inject angular services to controller*/
    ModalUploadContentController.$inject = ['$scope', '$uibModalInstance', 'items', '_', '$filter', 'CommonService'];

    /*Function ModalUploadContentController*/
    function ModalUploadContentController($scope, $uibModalInstance, items, _, $filter, CommonService) {
        $scope.items = items;

        $scope.data = {
            "ContentUri" : "asdasd",
            "Title" : "",
            "Description" : "",
            "Source" : "",
            "Creator": [''],
            "Publisher" : "",
            "ContentState": "",
            "Projects": [],
            "SubjectHeadings": [],
            "SubjectKeywords": [''],
            "SystemId": "",
            "DateCreated": "",
            "DateModified": "",
            "CreatedBy": "",
            "ModifiedBy": "",
            "DatePublished": "",
            "ContentResourceType": "",
            "FileFormat": "",
            "FileName": "",
            "FileSize": "",
            "FilePath": ""
            
        };


        $scope.cancel = closeModalProject;
        
        $scope.addRepeatedField = addRepeatedField;

        function closeModalProject() {
            $uibModalInstance.dismiss('cancel');
        }
        
        function addRepeatedField (dataArray, event) {
            dataArray.push('');
            $event.preventDefault();
        }

        /*Dyanmic project dropdown*/
        var tcounter = 0;

        $scope.projectslist = [{
            projectName : 'Hockenbury 5e-1',
        }, {
            projectName : 'Hockenbury 5e-2',
        }];

        // $scope.projectsdropdown = $scope.projectslist;

        $scope.addProjectsField = addProjectsField;

        function addProjectsField(projectslist, $event) {
            tcounter++;
            projectslist.push({
                id : tcounter,
                projectName : '',
                inline : true
            });
            $event.preventDefault();
        }

        /* start dropdown*/

        var counter = 0;
        $scope.data1 = {
            fields : [{
                name : ""
            }]
        };

        $scope.days = ['Hockenbury 5e-1', 'Hockenbury 5e-2', 'Hockenbury 5e-3', 'Hockenbury 5e-4', 'Hockenbury 5e-5'];

        $scope.addField = function() {
            $scope.data1.fields.push({
                name : "projectName " + counter++
            });
        };

        /* end dropdown*/
    }

    angular.module('cmsWebApp').directive('demoDisplay', function($compile) {

        return {
            scope : {
                demoDisplay : "=", //import referenced model to our directives scope
                demoDays : "="
            },
            templateUrl : 'views/dropdown-template.html',
            link : function(scope, elem, attr, ctrl) {
                /*
                 scope.$watch('demoDisplay', function() { // watch for when model changes

                 elem.html("") //remove all elements

                 angular.forEach(scope.demoDisplay, function(d) { //iterate list
                 var s = scope.$new(); //create a new scope
                 angular.extend(s, d); //copy data onto it
                 console.log(scope.demoDays);

                 var template = '';
                 elem.append($compile(template)(s)); // compile template & append
                 });
                 }, true) //look deep into object
                 */
            }
        };
    });
    
})();
