(function() {"use strict";
    /**
     * ngdoc controller
     * @name cmsWebApp.controller:ModalUploadContentController
     * @description
     * ModalUploadContentController to manage upload Content.
     */
    angular.module('cmsWebApp').controller('ModalUploadContentController', ModalUploadContentController);

    /*Inject angular services to controller*/
    ModalUploadContentController.$inject = ['$scope', '$uibModalInstance', 'items', '_', '$filter', 'CommonService', '$log'];

    /*Function ModalUploadContentController*/
    function ModalUploadContentController($scope, $uibModalInstance, items, _, $filter, CommonService, $log) {
        $scope.items = items;

        $scope.data = {
            "ContentUri" : "asdasd",
            "Title" : "",
            "Description" : "",
            "Source" : "",
            "Creator": [''],
            "Publisher" : "",
            "ContentState": "",
            "Projects": [''],
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

        $scope.sourceData = ["Book", "Internet"];
        
        $scope.publisherData = ["Publisher", "Worth Publisher"];
        
        $scope.versionData = ["Vendor1", "Vendor2"];
        
        $scope.subjectHeadingsData = ["subject1","subject1"];
        
        $scope.cancel = closeModalProject;
        
        $scope.addRepeatedField = addRepeatedField;
        
        //search projects
        $scope.searchProject = searchProject;
        
        $scope.submit = submitContent;

        function closeModalProject() {
            $uibModalInstance.dismiss('cancel');
        }
        
        function addRepeatedField (dataArray, $event) {
            dataArray.push('');
            $event.preventDefault();
        }
        
        function submitContent(){
            $log.debug('submitContent', $scope.data);
        /**
         * @ngdoc method
         * @name searchProject
         * @methodOf cmsWebApp.controller:ModalUploadContentController
         * @description
         * search project based on text entered by used in form to select project.  
         */
        function searchProject(text) {
            
            SearchService.searchData('project', text).then(function(response){
                _.map(response.results, function(project){
                    var existingTitles = _.pluck($scope.ProjectsData, 'Title');
                    //checks whether project title is already added to list.
                    if(!_.contains(existingTitles, project.Title)){
                        $scope.ProjectsData.push(project);
                    }
                });
            });
           
        }
        }
    }

    
    
})();
