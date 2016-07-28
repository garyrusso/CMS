(function() {"use strict";
    /**
     * @ngdoc controller
     * @name cmsWebApp.controller:ViewProjectController
     * @description
     * ViewProjectController is the controller to manage view project page.
     */
    angular.module('cmsWebApp').controller('ViewProjectController', ViewProjectController);

    /*Inject angular services to controller*/
    ViewProjectController.$inject = ['$state', '$stateParams', 'routeResolvedProjectView', '$log', 'ManageProjectsService', 'ManageContentService'];

    /*Function ViewProjectController*/
    function ViewProjectController($state, $stateParams, routeResolvedProjectView, $log, ManageProjectsService, ManageContentService) {
        $log.debug('ViewProjectController', routeResolvedProjectView);
        var project = this;
        project.data = routeResolvedProjectView;
        project.data.uri = $stateParams['uri'];

        //TODO: move to Commonservice
        project.editProject = projectsEditProject;

        //TODO: move to Commonservice
        project.deleteProject = projectsdeleteProject;
        
        project.uploadContent = projectUploadContent;

        /**
         * @ngdoc method
         * @name projectsEditProject
         * @methodOf cmsWebApp.controller:ViewProjectController
         * @description
         * Invoke this method when edit project is clicked.
         * call ManageProjectsService > openProjectModal method to open edit project modal
         */
        function projectsEditProject() {
            project.data.projectURL = project.data.uri;
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
            project.data.projectURL = project.data.uri;
            ManageProjectsService.openDeleteProjectModal(project.data).then(function() {
                $log.debug('project deleted');
            });        
        }

        /**
         * @ngdoc method
         * @name projectUploadContent
         * @methodOf cmsWebApp.controller:ViewProjectController
         * @description
         * Invoke this method Upload content from project
         * call ManageContentService > openUploadContentModal method to open upload content modal
         */
        function projectUploadContent(project) {
            ManageContentService.openUploadContentModal(project).then(function () {
                $log.debug('Content Added from Project');
            });
        }

    }

})(); 