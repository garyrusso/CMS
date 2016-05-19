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
        $scope.projectStates =  ["In Progress", "Active", "Completed","Inactive"];

        

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
			/*$scope.data.dateLastModified = $filter('date')(_.now(), "yyyy-MM-dd hh:mm");*/
			var returnData = {
			    "Title": $scope.data.Title,
			    "Description" : $scope.data.description,
			    "ProjectState": $scope.data.projectState,
			    "SubjectHeadings": _.map($scope.data.subjectHeadings, function(eachHeading){
			        return eachHeading.subjectHeading;
			    }),
			    "SubjectKeywords": _.map($scope.data.subjectKeywords, function(eachKeyword){
			        return eachKeyword.subjectKeyword;
			    }),
			    "CreatedBy": $scope.data.createdBy,
			    "ModifiedBy": $scope.data.modifiedBy,
			    "DateCreated": $scope.data.dateCreated,
                "DateModified": $scope.data.dateLastModified
			};
            if (!items.edit) {
                /*$scope.data.dateCreated = $filter('date')(_.now(), "yyyy-MM-dd hh:mm");
				$scope.data.username = CommonService.getItems('username');*/
				returnData.CreatedBy = CommonService.getItems('username');
            } else {
                returnData.ModifiedBy = CommonService.getItems('username');
            }

            $uibModalInstance.close(returnData);
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


        /*Dyanmic project dropdown*/
        var tcounter = 0;  

        $scope.projectslist = [{
            projectName: 'Hockenbury 5e-1',
        }, {
            projectName: 'Hockenbury 5e-2',
        }]

       // $scope.projectsdropdown = $scope.projectslist;

        $scope.addProjectsField = addProjectsField;

        function addProjectsField(projectslist, $event) {            
            tcounter++;
            projectslist.push({
                id: tcounter,
                projectName: '',
                inline: true
            });
            $event.preventDefault();
        }



        /* start dropdown*/

        var counter = 0;
        $scope.data = {
            fields: [{ name: "" }]
        }

        $scope.days = ['Hockenbury 5e-1', 'Hockenbury 5e-2', 'Hockenbury 5e-3', 'Hockenbury 5e-4', 'Hockenbury 5e-5'];

        $scope.addField = function () {            
            $scope.data.fields.push({
                name: "projectName " + counter++
            });
        };
    



       
    /* end dropdown*/
    }

    angular.module('cmsWebApp').directive('demoDisplay', function ($compile) {
        
        return {
            scope: {
                demoDisplay: "=", //import referenced model to our directives scope
                demoDays: "="
            },
            templateUrl: 'views/dropdown-template.html',
            link: function (scope, elem, attr, ctrl) {
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
        }
    })
})();
