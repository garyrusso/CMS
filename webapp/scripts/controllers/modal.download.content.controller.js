(function() {"use strict";
    /**
     * @ngdoc controller
     * @name cmsWebApp.controller:ModalDownloadContentController
     * @description
     * ModalDownloadContentController to manage download Content.
     */
    angular.module('cmsWebApp').controller('ModalDownloadContentController', ModalDownloadContentController);

    /*Inject angular services to controller*/
    ModalDownloadContentController.$inject = ['$rootScope', '$scope', '$uibModalInstance', 'items', '_', '$log', '$q'];

    /*Function ModalDownloadController*/
    function ModalDownloadContentController($rootScope, $scope, $uibModalInstance, items, _, $log, $q) {
        $scope.items = items;

        $scope.data = {};
        $scope.data.noteText = '';
        $scope.data.filePath = $scope.items.data.FileName;
        /*Download content*/
        //  $scope.downloadContent=downloadContent;

        /*close dialog/modal*/
        $scope.cancel = CloseModalContent;
        
        $scope.downloadContent = downloadContent;

        /**
         * @ngdoc method
         * @name CloseModalContent
         * @methodOf cmsWebApp.controller:ModalDownloadContentController
         * @description
         * Close dialog/modal
         */
        function CloseModalContent() {
            $uibModalInstance.dismiss('cancel');
        }

        /**
         * @ngdoc method
         * @name downloadContent
         * @methodOf cmsWebApp.controller:ModalDownloadContentController
         * @description
         * Close dialog/modal and pass the text enter by user to parent.
         */
        function downloadContent () {
            $uibModalInstance.close(angular.copy($scope.data));
        }
    }

})();
