/**
 * @ngdoc Overview
 * @name: ModalDeleteProjectController
 * @description 
 * ModalDeleteProjectController 
 **/

(function() {"use strict";
    angular.module('cmsWebApp').controller('ModalDeleteProjectController', ModalDeleteProjectController);

    /*Inject angular services to controller*/
    ModalDeleteProjectController.$inject = ['$scope', '$uibModalInstance', 'items', '$log'];

    /*Function ModalDeleteProjectController*/
    function ModalDeleteProjectController($scope, $uibModalInstance, items, $log) {
        $log.debug('ModalDeleteProjectController');
        $scope.items = items;
        $scope.cancel = closeModalProject;
        $scope.deleteProject = deleteProject;
        
        /**
         * @name closeModalProject
         * @description 
         * Purpose to close the modal window 
         */
        function closeModalProject () {
            $uibModalInstance.dismiss('cancel');
        }
        
        /**
         * @name deleteProject
         * @description 
         * Purpose to Delete Project 
         */
        function deleteProject () {
            $uibModalInstance.close($scope.items.data);
        }
    }

})();