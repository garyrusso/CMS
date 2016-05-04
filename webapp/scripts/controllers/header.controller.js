/**
 * Controller Name: HeaderController
 * Desc: HeaderController manages all header functionality
 *
 **/

(function() {"use strict";
    angular.module('cmsWebApp').controller('HeaderController', HeaderController);

    /*Inject angular services to controller*/
    HeaderController.$inject = ['$scope', '$uibModal'];

    /*Function HeaderController*/
    function HeaderController($scope, $uibModal) {
        var header = this;
        
        /* function to open modal window with create project form */
        header.onclickCreateEditProject = onclickCreateEditProject;
        
        $scope.$on('createProjectHeaderOnEvent', createProjectHeaderOnEvent);
        
        /*
         * Name: onclickCreateEditProject
         * params: (boolean) editProject - modal is loaded with edit form or new form.
         * Desc:
         * open modal window with create project form
         */
        function onclickCreateEditProject(editProject) {
            var modalInstance = $uibModal.open({
                templateUrl : 'views/modal-template.html',
                controller : 'ModalCreateEditProjectController',
                size : 'lg',
                resolve : {
                    items : function() {
                        return {
                            templateUrl: 'views/create-edit-project.html',
                            edit: editProject
                        };
                    }
                }
            });

            modalInstance.result.then(function(selectedItem) {
                $scope.selected = selectedItem;
            }, function() {
                
            });
        }
        
        /*
         * Name: createProjectHeaderOnEvent
         * 
         * Desc:
         * function called when create function is called from other controllers
         */
        function createProjectHeaderOnEvent() {
            header.onclickCreateEditProject(false);
        }
    }

})();
