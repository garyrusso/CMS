/*
 * Name: ModalShowAllFacetsItemsController
 * Desc:
 *  Controller to filter & select facet's in modal.
 */
(function(){
    "use strict";
    angular.module('cmsWebApp').controller('ModalShowAllFacetsItemsController', ModalShowAllFacetsItemsController);
    
    /*Inject angular services*/
    ModalShowAllFacetsItemsController.$inject = ['$scope', '$uibModalInstance', 'items', '$state', '$stateParams', '_'];
    
    function ModalShowAllFacetsItemsController ($scope, $uibModalInstance, items, $state, $stateParams, _) {
        $scope.items = items;
        
        /*Close modal box*/
        $scope.cancel = closeModalProject;
        
        $scope.prepareFacetUri = prepareFacetUri;
        
        $scope.facetSelected = [];
        
        if($stateParams.facet) {
            if(_.isArray($stateParams.facet)) {
                $scope.facetSelected = angular.copy($stateParams.facet);
            } else {
                $scope.facetSelected.push($stateParams.facet);
            }
        }
        
        /*Close modal box*/
        function closeModalProject () {
             $uibModalInstance.dismiss('cancel');
        }
        
        //TODO desc
        function prepareFacetUri (text) {
            var facetsSelected = angular.copy($scope.facetSelected);
            
            if(!_.contains(facetsSelected, text)) {
                facetsSelected.push(text);
            }
            return facetsSelected;
        }
    }
    
})();
