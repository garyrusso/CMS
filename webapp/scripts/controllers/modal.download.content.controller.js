(function() { "use strict";
/**
 * @ngdoc controller
 * @name cmsWebApp.controller:ModalDownloadContentController
 * @description
 * ModalDownloadContentController to manage download Content.
 */
 angular.module('cmsWebApp').controller('ModalDownloadContentController',ModalDownloadContentController);
 
  /*Inject angular services to controller*/
  ModalDownloadContentController.$inject=['$rootScope', '$scope', '$uibModalInstance', 'items', '_', '$log', '$q'];
  
  /*Function ModalDownloadController*/
  function ModalDownloadContentController($rootScope, $scope, $uibModalInstance, items, _, $log, $q)
  {
    $scope.items=items;  
   
    
   /*Download content*/
 //  $scope.downloadContent=downloadContent;
    
    /*close dialog/modal*/
   $scope.cancel=CloseModalContent;
   
   /**
    * @ngdoc method
    * @name CloseModalContent
    * @methodOf cmsWebApp.controller: ModalDownloadContentController
    * @description
    * Close dialog/modal 
    */
   function CloseModalContent()
   {       
       $uibModalInstance.dismiss('cancel');
   }
     
     
     $scope.downloadContent = function() {
             $uibModalInstance.close(angular.copy($scope.noteText));
        };
  }
 

})();
