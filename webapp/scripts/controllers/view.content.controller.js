(function() {"use strict";
    /**
     * @ngdoc controller
     * @name cmsWebApp.controller:ViewContentController
     * @description
     * ViewContentController is the controller to manage view content page
     */
    angular.module('cmsWebApp').controller('ViewContentController', ViewContentController);

    /*Inject angular services to controller*/
    ViewContentController.$inject = ['$state', '$stateParams', 'routeResolvedContentView', '$log', 'ManageContentService', 'DataModelContentService'];

    /*Function ViewContentController*/
    function ViewContentController($state, $stateParams, routeResolvedContentView, $log, ManageContentService, DataModelContentService) {
        $log.debug('ViewContentController', routeResolvedContentView);
        routeResolvedContentView.contentUri = $stateParams['uri'];
        var content = this, dataModelContent = new DataModelContentService(routeResolvedContentView);
        content.data = angular.copy(dataModelContent.getContent());

        //TODO: move to Commonservice
        content.editContent = contentEditContent;

        //TODO: move to Commonservice
        content.deleteContent = contentdeleteContent;

        //TODO: move to Commonservice
        content.downloadContent = contentDownloadContent;
        
        /**
         * @ngdoc method 
         * @name projectsEditProject
         * @methodOf cmsWebApp.controller:ViewContentController
         * @description
         * Invoke this function when edit content is clicked. 
         * call ManageContentService > openProjectModalopen method to open edit content form in modal. 
         */
        function contentEditContent() {
            ManageContentService.openProjectModal(true, project.data).then(function() {
                $log.debug('project updated');
            });
        }

        /**
         * @ngdoc method
         * @name contentdeleteContent
         * @methodOf cmsWebApp.controller:ViewContentController
         * @description
         * call ManageContentService > openDeleteContentModal method to open delete content modal.
         */
        function contentdeleteContent() {
            ManageContentService.openDeleteContentModal(content.data).then(function() {
                $log.debug('Content deleted');
            });
        }


         /**
         * @ngdoc method 
         * @name contentDownloadContent
         * @methodOf cmsWebApp.controller:ViewContentController 
         * @description
         * call ManageContentService > openDownloadContentModal method to open download content modal.
         */
        function contentDownloadContent() {  
            ManageContentService.openDownloadContentModal(content.data).then(function() {
                $log.debug('Content download');
            });        
        }

    }

})();
