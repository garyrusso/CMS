(function() {"use strict";
    /**
     * @ngdoc controller
     * @name cmsWebApp.controller:ViewContentController
     * @description
     * ViewContentController
     **/

    angular.module('cmsWebApp').controller('ViewContentController', ViewContentController);

    /*Inject angular services to controller*/
    ViewContentController.$inject = ['$state', 'routeResolvedContentView', '$log', 'ManageContentService', 'DataModelContentService'];

    /*Function ViewContentController*/
    function ViewContentController($state, routeResolvedContentView, $log, ManageContentService, DataModelContentService) {
        $log.debug('ViewContentController', routeResolvedContentView);
        var content = this, dataModelContent = new DataModelContentService(routeResolvedContentView);
        content.data = angular.copy(dataModelContent.getContent());

        /*project.data.subjects = _.chain(routeResolvedProjectView.SubjectHeadings).indexBy('subjectHeading').keys().value();
        project.data.keywords = _.chain(routeResolvedProjectView.SubjectKeywords).indexBy('subjectKeyword').keys().value();*/

        //TODO: move to Commonservice
        content.editContent = contentEditContent;

        //TODO: move to Commonservice
        content.deleteContent = contentdeleteContent;

        //TODO: move to Commonservice
        content.downloadContent = contentDownloadContent;
        
        /**
         * @name projectsEditProject
         * @description
         * Edit project function.
         */
        function contentEditContent() {
            ManageContentService.openProjectModal(true, project.data).then(function() {
                $log.debug('project updated');
            });
        }

        /**
         * @name contentdeleteContent
         * @description
         * Delete project function.
         */
        function contentdeleteContent() {
            ManageContentService.openDeleteContentModal(content.data).then(function() {
                $log.debug('Content deleted');
            });
        }


         /**
         * @ngdoc method 
         * @name cmsWebApp.controller:ViewContentController 
         * @description
         * Delete project function.
         */
        function contentDownloadContent() {  
            ManageContentService.openDownloadContentModal(content.data).then(function() {
                $log.debug('Content deleted');
            });        
        }

    }

})();
