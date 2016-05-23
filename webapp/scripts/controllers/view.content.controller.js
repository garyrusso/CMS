(function() {"use strict";
/**
 * @ngdoc overview
 * @name ViewContentController
 * @description
 * ViewContentController
 **/

  
    angular.module('cmsWebApp').controller('ViewContentController', ViewContentController);

    /*Inject angular services to controller*/
    ViewContentController.$inject = ['$state', 'routeResolvedContentView', '$log', 'ManageContentService'];

    /*Function ViewContentController*/
    function ViewContentController($state, routeResolvedContentView, $log, ManageContentService) {
        $log.debug('ViewContentController', routeResolvedContentView);     
        var content = this;
      
        content.data = routeResolvedContentView;
      
        /*project.data.subjects = _.chain(routeResolvedProjectView.SubjectHeadings).indexBy('subjectHeading').keys().value();
        project.data.keywords = _.chain(routeResolvedProjectView.SubjectKeywords).indexBy('subjectKeyword').keys().value();*/

        //TODO: move to Commonservice
        content.editProject = contentEditProject;

        //TODO: move to Commonservice
        content.deleteProject = contentdeleteProject;

        /**
         * @name projectsEditProject
         * @description
         * Edit project function.
         */
        function contentEditProject() {
            ManageProjectsService.openProjectModal(true, project.data).then(function() {
                $log.debug('project updated');
            });
        }

        /**
         * @name projectsdeleteProject
         * @description
         * Delete project function.
         */
        function contentdeleteProject() {  
            ManageProjectsService.openDeleteProjectModal(project.data).then(function() {
                $log.debug('project deleted');
            });        
        }

    }

})(); 