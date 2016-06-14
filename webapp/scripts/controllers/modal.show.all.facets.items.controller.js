(function(){
    "use strict";
    /**
     * @ngdoc controller
     * @name cmsWebApp.controller:ModalShowAllFacetsItemsController
     * @description
     * ModalShowAllFacetsItemsController is the Controller to filter & select facet's in modal.
     */
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
        
        /**
         * @ngdoc method
         * @name closeModalProject
         * @methodOf cmsWebApp.controller:ModalShowAllFacetsItemsController
         * @description
         * Close modal box 
         */
        function closeModalProject () {
             $uibModalInstance.dismiss('cancel');
        }
        
        /**
         * @ngdoc method
         * @name prepareFacetUri
         * @methodOf cmsWebApp.controller:ModalShowAllFacetsItemsController
         * @param {String} text key to check & add to stateparams for multiple selection of facet 
         * @description
         * Check & add the key to facet object to pass to ui-sref for mutliple selection of facets.
         * @returns {Object} facetsSelected object of stateparam with new facet key.
         */
        function prepareFacetUri (text) {
            var facetsSelected = angular.copy($scope.facetSelected);
            
            if(!_.contains(facetsSelected, text)) {
                facetsSelected.push(text);
            }
            return facetsSelected;
        }
    }
    
})();
