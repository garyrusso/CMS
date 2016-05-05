/*
 * Name: ModalShowAllFacetsItemsController
 * Desc:
 *  Controller to filter & select facet's in modal.
 */
(function(){
    "use strict";
    angular.module('cmsWebApp').controller('ModalShowAllFacetsItemsController', ModalShowAllFacetsItemsController);
    
    /*Inject angular services*/
    ModalShowAllFacetsItemsController.$inject = ['$scope', '$uibModalInstance', 'items'];
    
    function ModalShowAllFacetsItemsController ($scope, $uibModalInstance, items) {
        $scope.items = items;
        
        /*Close modal box*/
        $scope.cancel = closeModalProject;
        
        /*Close modal box*/
        function closeModalProject () {
             $uibModalInstance.dismiss('cancel');
        }
    }
    
})();
