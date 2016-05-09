/*
 * Name: CommonService
 * Desc:
 *  All global functionality used in all controllers across the system availaible here.
 */
(function() {"use strict";
    angular.module('cmsWebApp').service('CommonService', CommonService);
    
    /*Inject angular services*/
    CommonService.$inject = ['$uibModal'];
    
    /*  All global functionality used in all controllers across the system availaible here.*/
    function CommonService($uibModal) {
        return {
            showAllFacetsItems : showAllFacetsItems
        };
        
        function showAllFacetsItems (facetObj) {
            var modalInstance = $uibModal.open({
                templateUrl : 'views/modal-template.html',
                controller : 'ModalShowAllFacetsItemsController',
                size : 'sm',
                resolve : {
                    items : function() {
                        return {
                            templateUrl : 'views/modal-show-all-facets.html',
                            facetObj : facetObj
                        };
                    }
                }
            });

            modalInstance.result.then(function(selectedItem) {
                $scope.selected = selectedItem;
            }, function() {

            });
        }
    }

})();
