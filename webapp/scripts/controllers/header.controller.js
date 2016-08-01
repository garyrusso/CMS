(function() {"use strict";
    /**
     * @ngdoc controller
     * @name cmsWebApp.controller:HeaderController
     * @description 
     * HeaderController manages all header functionality
     */
    angular.module('cmsWebApp').controller('HeaderController', HeaderController);

    /*Inject angular services to controller*/
    HeaderController.$inject = ['$scope', '$state', '$stateParams', '$uibModal', 'CommonService', 'AuthenticationService', 'ManageProjectsService', 'ManageContentService', '$log'];

    /*Function HeaderController*/
    function HeaderController($scope, $state, $stateParams, $uibModal, CommonService, AuthenticationService, ManageProjectsService, ManageContentService, $log) {
        var header = this;

        header.searchType = 'all'; //by default

        header.searchTypeDisplayText = 'All Types'; //by default
        
        header.searchTextBox = '';
        
        header.searchData = searchData;
        
        header.userDetails = CommonService.getItems('cms.user_details');
        
        header.userLogOut = userLogOut;
        
        header.changeSearchType = changeSearchType;
        
        /* function to open modal window with create project form */
        header.onclickCreateEditProject = onclickCreateEditProject;

        /* function to open modal window with Upload content form */
        header.onclickUploadContent = onclickUploadContent;
        
        $scope.$on('stateChange', function(event, args){
            if(args.state!=='search'){
                header.searchTextBox = '';
            }
        });

        
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
            });
        }
        
        /**
         * @ngdoc method
         * @name onclickUploadContent
         * @methodOf cmsWebApp.controller:HeaderController
         * @description
         * open modal window with upload content form
         */
        function onclickUploadContent () {
            ManageContentService.openUploadContentModal();
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
            header.searchTypeDisplayText = (searchType !== 'all') ? searchType : 'All Types';
        }

        /**
         * @ngdoc method
         * @name searchData
         * @methodOf cmsWebApp.controller:HeaderController
         * @description
         * Submit search params to search page
         */
        function searchData() {
            var params = {
                searchType: header.searchType,
                searchText: header.searchTextBox
            };
            if(header.searchTextBox && header.searchTextBox.trim()){
                $state.go('search', params, {inherit:false});
            }
        }
        
        
        
        
    }

})();
