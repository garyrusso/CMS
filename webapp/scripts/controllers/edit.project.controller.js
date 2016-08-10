(function() {"use strict";
    /**
     * @ngdoc controller
     * @name cmsWebApp.controller:EditProjectController
     * @description 
     * EditProjectController to manage edit project.
     */
    angular.module('cmsWebApp').controller('EditProjectController', EditProjectController);

    /*Inject angular services to controller*/
    EditProjectController.$inject = ['$scope', '$rootScope', '$state', '$stateParams', 'routeResolvedProjectEdit', 'getProjectMasterDataProjectState', 'getProjectMasterDataSubjects', '_', '$filter', 'CommonService', '$log', 'ManageProjectsService', 'ManageContentService'];

    /*Function EditProjectController*/
    function EditProjectController($scope, $rootScope, $state, $stateParams, routeResolvedProjectEdit, getProjectMasterDataProjectState, getProjectMasterDataSubjects, _, $filter, CommonService, $log, ManageProjectsService, ManageContentService) {
        $log.debug('EditProjectController - $stateParams', $stateParams);
        routeResolvedProjectEdit.projectUri = $stateParams['uri'];
        var project = this;
        project.data = routeResolvedProjectEdit;
        
        project.deleteProject = projectsdeleteProject;
        
        project.uploadContent = projectUploadContent;
        
        project.titleCopy = (project && project.data && project.data.title)? project.data.title : '';
        $rootScope.setLoading(false);
       

            if (project.data && project.data.subjectHeading ) {
                project.data.subjectHeadings = project.data.subjectHeading;
            } else {
                project.data.subjectHeadings = [];
            }
            if (project.data && project.data.subjectKeyword && project.data.subjectKeyword.length !== 0) {
                project.data.subjectKeywords = project.data.subjectKeyword;
            } else {
                project.data.subjectKeywords = [""];
            }
        

      

        /*Project state dropdown*/
        project.projectStates = [];
        
        if(getProjectMasterDataProjectState && getProjectMasterDataProjectState.results && getProjectMasterDataProjectState.results.val){
            project.projectStates = _.pluck(getProjectMasterDataProjectState.results.val, 'value');
        }
        
        

        /*Project Subject dropdown */
        project.subjects = [];
        
        if(getProjectMasterDataSubjects && getProjectMasterDataSubjects.results && getProjectMasterDataSubjects.results.val){
            project.subjects = _.pluck(getProjectMasterDataSubjects.results.val, 'value');
        }

        project.statuses = project.subjects;

        project.addKeywordField = addKeywordField;

        /* Create/Update Project submit function*/
        project.submit = submitProject;
        
        /**
         * @ngdoc method
         * @name submitProject
         * @methodOf cmsWebApp.controller:EditProjectController
         * @description
         * Update Project submit function
         */
        function submitProject () {
            $rootScope.setLoading(true);
            ManageProjectsService.updateProject(angular.copy(project.data)).then(function (data) {
                        $rootScope.setLoading(false);
                        $state.go('success', { type: 'project', status: 'edit', name: data.title, id: project.data.projectUri }, { location: false });
                    });
        }

        /**
         * @ngdoc method
         * @name addKeywordField
         * @methodOf cmsWebApp.controller:EditProjectController
         * @param {Array} keyword keyword
         * @param {Object} $event event
         * @description
         * Add an empty element to array. When user click on add new keyword ie., +(plus) 
         * new empty element added to existing array. so that user can see empty new textbox 
         * on form. 
         */
        function addKeywordField(keyword, $event) {
            keyword.push('');
            $event.preventDefault();
        }
        
        /**
         * @ngdoc method
         * @name projectsdeleteProject
         * @methodOf cmsWebApp.controller:EditProjectController
         * @description
         * Invoke this method when delete project is clicked.
         * call ManageProjectsService > openDeleteProjectModal method to open delete project modal
         */
        function projectsdeleteProject() {
            project.data.ProjectURL = project.data.projectUri;
            ManageProjectsService.openDeleteProjectModal(project.data).then(function() {
                $log.debug('project deleted');
            });        
        }

        /**
         * @ngdoc method
         * @name projectUploadContent
         * @methodOf cmsWebApp.controller:EditProjectController
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
