/**
 * Controller Name: ModalCreateEditProjectController
 * Desc: ModalCreateEditProjectController to manage edit/create project.
 *
 **/

(function() {"use strict";
    angular.module('cmsWebApp').controller('ModalCreateEditProjectController', ModalCreateEditProjectController);

    /*Inject angular services to controller*/
    ModalCreateEditProjectController.$inject = ['$scope', '$uibModalInstance', 'items'];

    /*Function ModalCreateEditProjectController*/
    function ModalCreateEditProjectController($scope, $uibModalInstance, items) {
        $scope.items = items;
        if(items.edit) {
            $scope.data = {
            "Title" : "Hockenbury 5e-4",
            "uri" : "/mydocuments/project4.xml",
            "path" : "fn:doc(\"/mydocuments/project4.xml\")",
            "href" : "/v1/documents?uri=%2Fmydocuments%2Fproject4.xml",
            "mimetype" : "application/xml",
            "format" : "xml",
            "dateLastModified" : "2015-04-18 13:30",
            "username" : "bcross3",
            "fullName" : "Brian Cross3"
            };
        }
        $scope.cancel = closeModalProject;
        
        function closeModalProject () {
             $uibModalInstance.dismiss('cancel');
        }
    }

})();