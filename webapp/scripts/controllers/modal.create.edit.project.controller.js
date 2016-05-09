/**
 * Controller Name: ModalCreateEditProjectController
 * Desc: ModalCreateEditProjectController to manage edit/create project.
 *
 **/

(function() {"use strict";
    angular.module('cmsWebApp').controller('ModalCreateEditProjectController', ModalCreateEditProjectController);

    /*Inject angular services to controller*/
    ModalCreateEditProjectController.$inject = ['$scope', '$uibModalInstance', '$http', '$httpBackend', 'items'];


  
    /*Function ModalCreateEditProjectController*/
    function ModalCreateEditProjectController($scope, $uibModalInstance, $http, $httpBackend, items) {
        $scope.items = items;

        if (items.edit) {
            $scope.data = {
                "Title": "Hockenbury 5e-4",
                "description": "Project description",
                "projectState": "Active",
                "subjectHeadings": [
                    {
                        "subjectHeading": "Psychology"
                    },
                    {
                        "subjectHeading": "Biology"
                    }
                ],
                "subjectKeywords": [
                     {
                         "subjectKeyword": "Psychology"
                     },
                     {
                         "subjectKeyword": "Biology"
                     }
                ]
            };

        } else {
            $scope.data = {
                "Title": "",
                "description": "",
                "projectState": "",
                "subjectHeadings": [
                    {
                        "subjectHeading": ""
                    },
                    {
                        "subjectHeading": ""
                    }
                ],
                "subjectKeywords": [
                     {
                         "subjectKeyword": ""
                     },
                     {
                         "subjectKeyword": ""
                     }
                ]
            }
        }
      
        $scope.cancel = closeModalProject;
        
        function closeModalProject () {
            $uibModalInstance.dismiss('cancel');
        }

       
     
        /*Project state dropdown*/
        var projectStates = {
            stepsInvolved: [{
                label: "In Progress",
                value: "In Progress"
            }, {
                label: "Active",
                value: "Active"
            }, {
                label: "Completed",
                value: "Completed"
            },{
                label: "Inactive",
                value: "Inactive"
            }],
            valueSelected: {
                label: $scope.data.projectState,
                value: $scope.data.projectState
            }
        }

        $scope.list = projectStates.stepsInvolved;
        $scope.selected = projectStates.valueSelected;

        /*Project Subject dropdown */
        $scope.subjects = [
            { "subjectHeading": "Psychology" },          
            { "subjectHeading": "Economics" },
            { "subjectHeading": "History" }
        ]
               
     
        $scope.statuses = $scope.subjects;
        $scope.selectedStatuses = $scope.data.subjectHeadings;

       
        /* Create/Update Proejct submit function*/
        $scope.submit = function () {
            
            var res = $http.post("project", $scope.data);

            res.success(function (data, status, headers, config) {                
                alert("success");
            });
            res.error(function (data, status, headers, config) {
                 alert("failure message: " + JSON.stringify({ data: data }));
            });

        };

        /*Dyanmic Keyword textbox*/
        var counter = 0;

        $scope.keyword = $scope.data.subjectKeywords;

        $scope.addKeywordField = addKeywordField;

        function addKeywordField(keyword, $event) {
            counter++;
            keyword.push({ id: counter, subjectKeyword: '', inline: true });
            $event.preventDefault();
        }
        

    }

})();