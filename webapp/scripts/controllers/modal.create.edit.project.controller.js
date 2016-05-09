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

        //Project state
        $scope.projectState = {
            availableOptions: [
              { id: '1', name: 'In Progress' },
              { id: '2', name: 'Active' },
              { id: '3', name: 'Completed' },
              { id: '4', name: 'Inactive' }
            ],
            selectedOption: { id: '0', name: '' } //This sets the default value of the select in the ui
        };

        // Create Proejct submit
        $scope.submit = function () {          
            var res = $http.post("/echo/json/", $scope.data);
            res.success(function (data, status, headers, config) {
                $scope.projects = data;                
            });
            res.error(function (data, status, headers, config) {
                 alert("failure message: " + JSON.stringify({ data: data }));
            });

        };

        //Dyanmic Keyword textbox
        var counter = 0;


        $scope.keyword = [{
            value: '',
        }, {
            value: '',
        }]


        $scope.addKeywordField = addKeywordField;

        function addKeywordField(keyword, $event) {
            counter++;
            keyword.push({ id: counter, name: '', inline: true });
            $event.preventDefault();
        }
        

    }

})();