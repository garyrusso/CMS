/**
 * @ngdoc Overview
 * @name: ModalDeleteProjectController
 * @description 
 * ModalDeleteProjectController 
 **/

(function() {"use strict";
    angular.module('cmsWebApp').controller('ModalDeleteProjectController', ModalDeleteProjectController);

    /*Inject angular services to controller*/
    ModalDeleteProjectController.$inject = ['$scope', '$uibModalInstance', 'items', '_','$log', 'CommonService'];

    /*Function ModalDeleteProjectController*/
    function ModalDeleteProjectController($scope, $uibModalInstance, items, _, $log, CommonService) {
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
            var returnData = angular.copy($scope.items.data);
            /*returnData.subjectHeadings = _.map(returnData.subjectHeadings, function(eachHeading){
                    return eachHeading.subjectHeading;
                });
            returnData.subjectKeywords = _.map(returnData.subjectKeywords, function(eachKeyword){
                    return eachKeyword.subjectKeyword;
                }); */
            
            returnData.ModifiedBy = CommonService.getItems('username');
            /*returnData = _.chain(returnData)
                          .omit('username')
                          .omit('dateLastModified')
                          .omit('keywords')
                          .value();   */ 
            $uibModalInstance.close(returnData);
        }
    }

})();