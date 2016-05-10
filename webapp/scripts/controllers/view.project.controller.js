/**
 * @ngdoc overview
 * @name ViewProjectController
 * @description
 * ViewProjectController
 **/

(function() {"use strict";
    angular.module('cmsWebApp').controller('ViewProjectController', ViewProjectController);

    /*Inject angular services to controller*/
    ViewProjectController.$inject = ['$state', 'routeResolvedProjectView', '$log', 'ManageProjectsService'];

    /*Function ViewProjectController*/
    function ViewProjectController($state, routeResolvedProjectView, $log, ManageProjectsService) {
        $log.debug('ViewProjectController', routeResolvedProjectView);
        var project = this;
        project.data = routeResolvedProjectView;
        project.data.subjects = _.chain(routeResolvedProjectView.subjectHeadings).indexBy('subjectHeading').keys().value();
        project.data.keywords = _.chain(routeResolvedProjectView.subjectKeywords).indexBy('subjectKeyword').keys().value();

        //TODO: move to Commonservice
        project.editProject = projectsEditProject;

        //TODO: move to Commonservice
        project.deleteProject = projectsdeleteProject;

        /**
         * @name projectsEditProject
         * @description
         * Edit project function.
         */
        function projectsEditProject() {
            ManageProjectsService.openProjectModal(true, project.data).then(function() {
                $log.debug('project updated');
            });
        }

        /**
         * @name projectsdeleteProject
         * @description
         * Delete project function.
         */
        function projectsdeleteProject() {  
            ManageProjectsService.openDeleteProjectModal(project.data).then(function() {
                $log.debug('project deleted');
            });        
        }

    }

})(); 