(function() {"use strict";
    /**
     * @ngdoc controller
     * @name cmsWebApp.controller:ModalDeleteProjectController
     * @description 
     * ModalDeleteProjectController manages delete project modal
     */
    angular.module('cmsWebApp').controller('ModalDeleteProjectController', ModalDeleteProjectController);

    /*Inject angular services to controller*/
    ModalDeleteProjectController.$inject = ['$scope', '$uibModalInstance', 'items', '_','$log', 'CommonService'];

    /*Function ModalDeleteProjectController*/
    function ModalDeleteProjectController($scope, $uibModalInstance, items, _, $log, CommonService) {
        $log.debug('ModalDeleteProjectController');
        $scope.items = items;
        $scope.cancel = closeModalProject;
        $scope.deleteProject = deleteProject;

        if ($scope.items.data && $scope.items.data.subjectHeadings && $scope.items.data.subjectHeadings.subjectHeading) {
            $scope.items.data.subjectHeadings = $scope.items.data.subjectHeadings.subjectHeading;
        } else {
            $scope.items.data.subjectHeadings = [];
        }
        if ($scope.items.data && $scope.items.data.subjectKeywords && $scope.items.data.subjectKeywords.subjectKeyword) {
            $scope.items.data.subjectKeywords = $scope.items.data.subjectKeywords.subjectKeyword;
        } else {
            $scope.items.data.subjectKeywords = [""];
        }
        
        /**
         * @ngdoc method
         * @name closeModalProject
         * @methodOf cmsWebApp.controller:ModalDeleteProjectController
         * @description 
         * Purpose to close the modal window 
         */
        function closeModalProject () {
            $uibModalInstance.dismiss('cancel');
        }
        
        /**
         * @ngdoc method
         * @name deleteProject
         * @methodOf cmsWebApp.controller:ModalDeleteProjectController
         * @description 
         * Purpose to Delete Project 
         */
        function deleteProject () {
            var returnData = angular.copy($scope.items.data);
            
            returnData.modifiedBy = CommonService.getItems('username');
 
            $uibModalInstance.close(returnData);
        }
    }

})();