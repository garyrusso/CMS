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
        $rootScope.setLoading(false);
        if (items.edit) {
            $scope.data = items.data;

        } else {
            $scope.data = {
                "Title" : "",
                "Description" : "",
                "ProjectState" : "",
                "SubjectHeadings" : [],
                "SubjectKeywords" : [""]
            };
        }

        $scope.cancel = closeModalProject;

        function closeModalProject() {
            $uibModalInstance.dismiss('cancel');
        }

        /*Project state dropdown*/
        $scope.projectStates = [];//["In Progress", "Active", "Completed","Inactive"];
        
        if(getProjectMasterDataProjectState && getProjectMasterDataProjectState.results && getProjectMasterDataProjectState.results.val){
            $scope.projectStates = _.pluck(getProjectMasterDataProjectState.results.val, 'value');
        }
        
        

        /*Project Subject dropdown */
        $scope.subjects = [];//["Psychology", "Economics", "History", "Biology"];
        
        if(getProjectMasterDataSubjects && getProjectMasterDataSubjects.results && getProjectMasterDataSubjects.results.val){
            $scope.subjects = _.pluck(getProjectMasterDataSubjects.results.val, 'value');
        }

        /*$scope.selectedSubjects = _.chain($scope.subjects).indexBy('subjectHeading').mapObject(function(val, key) {
         return {selected: _.contains(_.pluck($scope.data.subjectHeadings), key)};
         }).value();*/

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
                /*$scope.data.dateCreated = $filter('date')(_.now(), "yyyy-MM-dd hh:mm");*/
                $scope.data.CreatedBy = CommonService.getItems('username');
                /*returnData.CreatedBy = CommonService.getItems('username');*/
            } else {
                $scope.data.ModifiedBy = CommonService.getItems('username');
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
