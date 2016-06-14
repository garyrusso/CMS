(function() {"use strict";
    /**
     * @ngdoc controller
     * @name cmsWebApp.controller:ModalDeleteContentController
     * @description 
     * ModalDeleteContentController manages delete content modal.
     */
    angular.module('cmsWebApp').controller('ModalDeleteContentController', ModalDeleteContentController);

    /*Inject angular services to controller*/
    ModalDeleteContentController.$inject = ['$scope', '$uibModalInstance', 'items', '_','$log', 'CommonService'];

    /*Function ModalDeleteContentController*/
    function ModalDeleteContentController($scope, $uibModalInstance, items, _, $log, CommonService) {
        $log.debug('ModalDeleteContentController');
        $scope.items = items;
        $scope.cancel = closeModalContent;
        $scope.deleteContent = deleteContent;
        
        /**
         * @ngdoc method
         * @name closeModalContent
         * @methodOf cmsWebApp.controller:ModalDeleteContentController
         * @description 
         * Purpose to close the modal window 
         */
        function closeModalContent () {
            $uibModalInstance.dismiss('cancel');
        }
        
        /**
         * @ngdoc method
         * @name deleteContent
         * @methodOf cmsWebApp.controller:ModalDeleteContentController
         * @description 
         * Purpose to Delete Content 
         */
        function deleteContent () {
            var returnData = angular.copy($scope.items.data);
            
            returnData.ModifiedBy = CommonService.getItems('username');

            $uibModalInstance.close(returnData);
        }
    }

})();