(function() {"use strict";
    /**
     * @ngdoc controller
     * @name cmsWebApp.controller:EditContentController
     * @description
     * EditContentController manages Edit content functionality
     */
    angular.module('cmsWebApp').controller('EditContentController', EditContentController);

    /*Inject angular services to controller*/
    EditContentController.$inject = ['$log', '$scope', '$rootScope', '$state', '$stateParams', 'routeResolvedContentEdit', 'ManageContentService', 'SearchService', 'DataModelContentService'];

    /*Function EditContentController*/
    function EditContentController($log, $scope, $rootScope, $state, $stateParams, routeResolvedContentEdit, ManageContentService, SearchService, DataModelContentService) {
        $log.debug('EditContentController - $stateParams', $stateParams);
        var content = this, dataModelContent = new DataModelContentService(routeResolvedContentEdit);
        content.data = angular.copy(dataModelContent.getContent());
        
        if(!content.data.Creator) {
            content.data.Creator = [''];
        }
        
        if(!content.data.SubjectKeywords) {
            content.data.SubjectKeywords = [''];
        }
        if(!content.data.Projects) {
            content.data.Projects = [''];
        }
        content.sourceData = ["Book", "Internet"];

        content.publisherData = ["Publisher", "Worth Publishers"];

        content.versionData = ["Vendor1", "Active"];

        content.subjectHeadingsData = ["Psychology", "subject1"];

        content.ProjectsData = [];

        //add repeated form elements
        content.addRepeatedField = addRepeatedField;

        //search projects
        content.searchProject = searchProject;

        //submit functionality
        content.submit = submitContent;
        
        content.deleteContent = contentdeleteContent;

        /**
         * @ngdoc method
         * @name addRepeatedField
         * @param {Array} dataArray array list with all exsiting elemnets
         * @param {Object} $event event of button plus
         * @methodOf cmsWebApp.controller:EditContentController
         * @description
         * Close dialog/modal
         */
        function addRepeatedField(dataArray, $event) {
            dataArray.push('');
            $event.preventDefault();
        }

        /**
         * @ngdoc method
         * @name searchProject
         * @methodOf cmsWebApp.controller:EditContentController
         * @description
         * search project based on text entered by used in form to select project.
         */
        function searchProject(text) {
            SearchService.searchData('project', text).then(function(response) {
                _.map(response.results, function(project) {
                    var existingTitles = _.pluck(content.ProjectsData, 'Title');
                    //checks whether project title is already added to list.
                    if (!_.contains(existingTitles, project.Title)) {
                        content.ProjectsData.push(project);
                    }
                });
            });

        }

        /**
         * @ngdoc method
         * @name submitContent
         * @methodOf cmsWebApp.controller:EditContentController
         * @description
         * function for on click of upload button in modal
         */
        function submitContent() {
            $log.debug('submitContent', content.data);
            $rootScope.setLoading(true);
            ManageContentService.updateContent(content.data).then(function(response){
                $rootScope.setLoading(false);
                $state.go('success', { type: 'content', status: 'edit', name: content.data.Title, id: content.data.ContentUri }, { location: false });
            });
        }
        
        /**
         * @ngdoc method
         * @name contentdeleteContent
         * @methodOf cmsWebApp.controller:EditContentController
         * @description
         * Delete project function.
         */
        function contentdeleteContent() {  
            ManageContentService.openDeleteContentModal(content.data).then(function() {
                $log.debug('Content deleted');
            });        
        }

    }

})();
