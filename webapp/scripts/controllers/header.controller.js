(function() {"use strict";
    /**
     * @ngdoc controller
     * @name cmsWebApp.controller:HeaderController
     * @description 
     * HeaderController manages all header functionality
     */
    angular.module('cmsWebApp').controller('HeaderController', HeaderController);

    /*Inject angular services to controller*/
    HeaderController.$inject = ['$scope', '$state', '$uibModal', 'CommonService', 'AuthenticationService', 'ManageProjectsService', '$log'];

    /*Function HeaderController*/
    function HeaderController($scope, $state, $uibModal, CommonService, AuthenticationService, ManageProjectsService, $log) {
        var header = this;

        header.searchType = 'All'; //by default
        
        header.userDetails = CommonService.getItems('cms.user_details');
        
        header.userLogOut = userLogOut;
        
        header.changeSearchType = changeSearchType;
        
        /* function to open modal window with create project form */
        header.onclickCreateEditProject = onclickCreateEditProject;
        
        /**
         * @ngdoc method
         * @name onclickCreateEditProject
         * @methodOf cmsWebApp.controller:HeaderController
         * @description
         * open modal window with create project form
         */
        function onclickCreateEditProject() {
            ManageProjectsService.openProjectModal(false).then(function() {
                $log.debug('project created - header');
                //$scope.$emit('onCreateProjectHeader', {});
            });
        }
        
        /**
         * @ngdoc method
         * @name userLogOut
         * @methodOf cmsWebApp.controller:HeaderController
         * @description
         * Logout function of header. 
         */
        function userLogOut () {
            AuthenticationService.authenticate(null);
            $state.go('login');
        }
        /**
         * @ngdoc method
         * @name changeSearchType
         * @methodOf cmsWebApp.controller:HeaderController
         * @param {String} searchType All/Project/Content are expected values
         * @description
         * Change the search Type of search in header.
         */
        function changeSearchType (searchType) {
            header.searchType = searchType;
        }
    }

})();
