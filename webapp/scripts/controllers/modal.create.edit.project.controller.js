(function() {"use strict";
    /**
     * @ngdoc controller
     * @name cmsWebApp.controller:ModalCreateEditProjectController
     * @description 
     * ModalCreateEditProjectController to manage edit/create project.
     */
    angular.module('cmsWebApp').controller('ModalCreateEditProjectController', ModalCreateEditProjectController);

    /*Inject angular services to controller*/
    ModalCreateEditProjectController.$inject = ['$scope', '$rootScope', '$uibModalInstance', 'items', 'getProjectMasterDataProjectState', 'getProjectMasterDataSubjects', '_', '$filter', 'CommonService'];

    /*Function ModalCreateEditProjectController*/
    function ModalCreateEditProjectController($scope, $rootScope, $uibModalInstance, items, getProjectMasterDataProjectState, getProjectMasterDataSubjects, _, $filter, CommonService) {
        $scope.items = items;
        $scope.titleCopy = (items && items.data && items.data.title)? items.data.title : '';
        $rootScope.setLoading(false);
        if (items.edit) {
            $scope.data = angular.copy(items.data);
            if ($scope.data && $scope.data.subjectHeading ) {
                $scope.data.subjectHeadings = $scope.data.subjectHeading;
            } else {
                $scope.data.subjectHeadings = [];
            }
            if ($scope.data && $scope.data.subjectKeyword) {
                $scope.data.subjectKeywords = $scope.data.subjectKeyword;
            } else {
                $scope.data.subjectKeywords = [""];
            }
        } else {
            $scope.data = {
                "title" : "",
                "description" : "",
                "projectState" : "",
                "subjectHeadings" : [],
                "subjectKeywords": [""]
            };
        }

        $scope.cancel = closeModalProject;

        function closeModalProject() {
            $uibModalInstance.dismiss('cancel');
        }

        /*Project state dropdown*/
        $scope.projectStates = [];
        
        if(getProjectMasterDataProjectState && getProjectMasterDataProjectState.results && getProjectMasterDataProjectState.results.val){
            $scope.projectStates = _.pluck(getProjectMasterDataProjectState.results.val, 'value');
        }
        
        

        /*Project Subject dropdown */
        $scope.subjects = [];
        
        if(getProjectMasterDataSubjects && getProjectMasterDataSubjects.results && getProjectMasterDataSubjects.results.val){
            $scope.subjects = _.pluck(getProjectMasterDataSubjects.results.val, 'value');
        }

        $scope.statuses = $scope.subjects;
        $scope.selectedStatuses = $scope.data.SubjectHeadings;

        $scope.addKeywordField = addKeywordField;

        /* Create/Update Project submit function*/
        $scope.submit = submitProject;
        
        /**
         * @ngdoc method
         * @name submitProject
         * @methodOf cmsWebApp.controller:ModalCreateEditProjectController
         * @description
         * Create/Update Project submit function
         */
        function submitProject () {
            if (!items.edit) {
                $scope.data.createdBy = CommonService.getItems('username');
            } else {
                $scope.data.modifiedBy = CommonService.getItems('username');
            }
            
            $uibModalInstance.close(angular.copy($scope.data));
        }

        /**
         * @ngdoc method
         * @name addKeywordField
         * @methodOf cmsWebApp.controller:ModalCreateEditProjectController
         * @param {Array} keyword keyword
         * @param {Object} $event event
         * @description
         * Add an empty element to array. When user click on add new keyword ie., +(plus) 
         * new empty element added to existing array. so that user can see empty new textbox 
         * on form. 
         */
        function addKeywordField(keyword, $event) {
            keyword.push('');
            $event.preventDefault();
        }

    }

})();
