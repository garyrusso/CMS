(function() {"use strict";
    /**
     * @ngdoc controller
     * @name cmsWebApp.controller:ViewProjectController
     * @description
     * ViewProjectController is the controller to manage view project page.
     */
    angular.module('cmsWebApp').controller('ViewProjectController', ViewProjectController);

    /*Inject angular services to controller*/
    ViewProjectController.$inject = ['$state', 'routeResolvedProjectView', '$log', 'ManageProjectsService', 'ManageContentService'];

    /*Function ViewProjectController*/
    function ViewProjectController($state, routeResolvedProjectView, $log, ManageProjectsService, ManageContentService) {
        $log.debug('ViewProjectController', routeResolvedProjectView);
        var project = this;
        project.data = routeResolvedProjectView;
        /*project.data.subjects = _.chain(routeResolvedProjectView.SubjectHeadings).indexBy('subjectHeading').keys().value();
        project.data.keywords = _.chain(routeResolvedProjectView.SubjectKeywords).indexBy('subjectKeyword').keys().value();*/

        //TODO: move to Commonservice
        project.editProject = projectsEditProject;

        //TODO: move to Commonservice
        project.deleteProject = projectsdeleteProject;
        
        project.uploadContent = ManageContentService.openUploadContentModal;

        /**
         * @ngdoc method
         * @name projectsEditProject
         * @methodOf cmsWebApp.controller:ViewProjectController
         * @description
         * Invoke this method when edit project is clicked.
         * call ManageProjectsService > openProjectModal method to open edit project modal
         */
        function projectsEditProject() {
            ManageProjectsService.openProjectModal(true, project.data).then(function() {
                $log.debug('project updated');
            });
        }

        /**
         * @ngdoc method
         * @name projectsdeleteProject
         * @methodOf cmsWebApp.controller:ViewProjectController
         * @description
         * Invoke this method when delete project is clicked.
         * call ManageProjectsService > openDeleteProjectModal method to open delete project modal
         */
        function projectsdeleteProject() {  
            ManageProjectsService.openDeleteProjectModal(project.data).then(function() {
                $log.debug('project deleted');
            });        
        }

    }

})(); 