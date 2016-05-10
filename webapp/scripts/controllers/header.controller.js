/**
 * Controller Name: HeaderController
 * Desc: HeaderController manages all header functionality
 *
 **/

(function() {"use strict";
    angular.module('cmsWebApp').controller('HeaderController', HeaderController);

    /*Inject angular services to controller*/
    HeaderController.$inject = ['$scope', '$state', '$uibModal', 'CommonService', 'AuthenticationService', 'ManageProjectsService', '$log'];

    /*Function HeaderController*/
    function HeaderController($scope, $state, $uibModal, CommonService, AuthenticationService, ManageProjectsService, $log) {
        var header = this;
        
        header.userDetails = CommonService.getItems('cms.user_details');
        
        header.userLogOut = userLogOut;
        
        /* function to open modal window with create project form */
        header.onclickCreateEditProject = onclickCreateEditProject;
        
        /**
         * @name onclickCreateEditProject
         * @description
         * open modal window with create project form
         */
        function onclickCreateEditProject() {
            ManageProjectsService.openProjectModal(false).then(function() {
                $log.debug('project created - header');
                //$scope.$emit('onCreateProjectHeader', {});
            });
        }
        
        function userLogOut () {
            AuthenticationService.authenticate(null);
            $state.go('login');
        }
    }

})();
