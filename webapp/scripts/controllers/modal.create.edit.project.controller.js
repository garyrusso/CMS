/**
 * Controller Name: ModalCreateEditProjectController
 * Desc: ModalCreateEditProjectController to manage edit/create project.
 *
 **/

(function() {"use strict";
    angular.module('cmsWebApp').controller('ModalCreateEditProjectController', ModalCreateEditProjectController);

    /*Inject angular services to controller*/
    ModalCreateEditProjectController.$inject = ['$scope', '$uibModalInstance', 'items', '_', '$filter', 'CommonService'];

    /*Function ModalCreateEditProjectController*/
    function ModalCreateEditProjectController($scope, $uibModalInstance, items, _, $filter, CommonService) {
        $scope.items = items;

        if (items.edit) {
            $scope.data = items.data;

        } else {
            $scope.data = {
                "systemUID" : "d41d8cd98f00b" + Math.random(),
                "uri" : '/projects/project' + Math.random() + '.xml',
                "path" : "fn:doc(\"/projects/project" + Math.random() + ".xml\")",
                "href" : "/v1/documents?uri=%2Fprojects%2Fproject1.xml",
                "mimetype" : "application/xml",
                "format" : "xml",
                "dateCreated" : '',
                "Title" : "",
                "description" : "",
                "projectState" : "",
                "subjectHeadings" : [],
                "subjectKeywords" : [{
                    "subjectKeyword" : ""
                }]
            };
        }

        $scope.cancel = closeModalProject;

        function closeModalProject() {
            $uibModalInstance.dismiss('cancel');
        }

        /*Project state dropdown*/
        var projectStates = {
            stepsInvolved : [{
                label : "In Progress",
                value : "In Progress"
            }, {
                label : "Active",
                value : "Active"
            }, {
                label : "Completed",
                value : "Completed"
            }, {
                label : "Inactive",
                value : "Inactive"
            }],
            valueSelected : {
                label : $scope.data.projectState,
                value : $scope.data.projectState
            }
        };

        $scope.list = projectStates.stepsInvolved;
        $scope.selected = projectStates.valueSelected;

        /*Project Subject dropdown */
        $scope.subjects = [{
            "subjectHeading" : "Psychology"
        }, {
            "subjectHeading" : "Economics"
        }, {
            "subjectHeading" : "History"
        },{
            "subjectHeading" : "Biology"
        }];

        /*$scope.selectedSubjects = _.chain($scope.subjects).indexBy('subjectHeading').mapObject(function(val, key) {
         return {selected: _.contains(_.pluck($scope.data.subjectHeadings), key)};
         }).value();*/

        $scope.statuses = $scope.subjects;
        $scope.selectedStatuses = $scope.data.subjectHeadings;

        /* Create/Update Proejct submit function*/
        //TODO format
        $scope.submit = function() {
			$scope.data.dateLastModified = $filter('date')(_.now(), "yyyy-MM-dd hh:mm");
            if (!items.edit) {
                $scope.data.dateCreated = $filter('date')(_.now(), "yyyy-MM-dd hh:mm");
				$scope.data.username = CommonService.getItems('username');
            }

            $uibModalInstance.close($scope.data);
        };

        /*Dyanmic Keyword textbox*/
        var counter = 0;

        $scope.keyword = $scope.data.subjectKeywords;

        $scope.addKeywordField = addKeywordField;

        function addKeywordField(keyword, $event) {
            counter++;
            keyword.push({
                id : counter,
                subjectKeyword : '',
                inline : true
            });
            $event.preventDefault();
        }

    }

})();
