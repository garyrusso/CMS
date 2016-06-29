(function() {"use strict";
    /**
     * @ngdoc service
     * @name cmsWebApp.service:ManageProjectsService
     * @description
     * ManageProjectsService purpose to manage all project related functionality
     */
    angular.module('cmsWebApp').service('ManageProjectsService', ManageProjectsService);

    /*Inject angular services*/
    ManageProjectsService.$inject = ['$rootScope', '$q', '_', '$http', '$log', 'APP_CONFIG', '$uibModal', '$state', 'CommonService', 'WS'];

    function ManageProjectsService($rootScope, $q, _, $http, $log, APP_CONFIG, $uibModal, $state, CommonService, WS) {
        return {
            getProjects : getProjects,
            viewProject : viewProject,
            openProjectModal: openProjectModal,
            openDeleteProjectModal : openDeleteProjectModal,
            createProject : createProject,
            updateProject : updateProject,
            deleteProject : deleteProject
        };

        /**
         * @ngdoc method
         * @name getProjects
         * @methodOf cmsWebApp.service:ManageProjectsService
         * @param {String} searchText searchText
         * @param {Integer} pageNumber pageNumber
         * @param {Integer} pageSize pageSize
         * @param {String} orderBy orderBy
         * @description
         * Get all projects based on search criteria
         * @returns {Object} http promise object
         */
        function getProjects(searchText, pageNumber, pageSize, orderBy) {
            $log.debug('getProjects - ManageProjectsService', searchText, pageNumber, pageSize, orderBy);
            var params = {
                searchText : searchText ? searchText : '',
                pageNumber : pageNumber ? parseInt(pageNumber) : 1,
                pageSize : pageSize ? parseInt(pageSize) : APP_CONFIG.limit,
                orderBy : orderBy ? orderBy : '',
            };

            return $http.get(WS.searchProjects, {
                params: params
            }).then(function(response) {
                return (response.data && response.data.results)? response.data.results : {};
            });
        }
        
        /**
         * @ngdoc method
         * @name viewProject
         * @methodOf cmsWebApp.service:ManageProjectsService
         * @param {String} uri project uri
         * @description
         * Get project details based on uri
         * @returns {Object} http promise object
         */
        function viewProject(uri) {
            $log.debug('viewProject - ManageProjectsService', uri);
            var params = {
                uri : _.isString(uri) ? uri : ''
            };

            return $http.get(WS.getProjectDetails, {
                params: params
            }).then(function (response) {
                var returnData = {};
                if (response.data && response.data.project && response.data.project.metadata) {
                    returnData = response.data.project.metadata;
                    if (response.data.project.contents && response.data.project.contents.content) {
                        returnData.content = response.data.project.contents.content;
                    }
                }
                return returnData;
            });
        }

        /**
         * @ngdoc method
         * @name openProjectModal
         * @methodOf cmsWebApp.service:ManageProjectsService
         * @param {Boolean} editProject - modal is loaded with edit form or new form.
         * @param {Object} data - get data on for edit project
         * @description
         * open modal window with create/Edit project form
         * @returns {Object} promise object
         */
        function openProjectModal(editProject, data) {
            var self = this, deffered = $q.defer(), modalInstance = $uibModal.open({
                templateUrl : 'views/modal-template.html',
                controller : 'ModalCreateEditProjectController',
                size : 'lg',
                resolve : {
                    items : function() {
                        return {
                            templateUrl : 'views/modal-create-edit-project.html',
                            edit : editProject,
                            data : data
                        };
                    },                
                    getProjectMasterDataProjectState : CommonService.getDictionary('project-status'),
                    getProjectMasterDataSubjects : CommonService.getDictionary('subject-heading')
                }                
             
            });
            $rootScope.setLoading(true);
            modalInstance.result.then(function(updatedData) {
                $rootScope.setLoading(true);
                if (editProject) {
                    self.updateProject(updatedData).then(function(data) {
                        deffered.resolve(data);
                        $rootScope.setLoading(false);
                        $state.go('success',{type:'project',status:'edit',name:data.Title,id:data.uri}, { location: false });
                    });
                } else {
                    self.createProject(updatedData).then(function(data) {
                        deffered.resolve(data);
                        $rootScope.setLoading(false);
                        $state.go('success',{type:'project',status:'new',name:data.Title,id:data.uri}, { location: false });
                    });
                }
            }, function() {

            });

            return deffered.promise;
        }
        
        /**
         * @ngdoc method
         * @name openDeleteProjectModal
         * @methodOf cmsWebApp.service:ManageProjectsService
         * @param {Object} data - get data on for delete project
         * @description
         * open modal window with Delete project form
         * @returns {Object} promise object
         */
        function openDeleteProjectModal (data) {
            var self = this, deffered = $q.defer(), modalInstance = $uibModal.open({
                templateUrl : 'views/modal-template.html',
                controller : 'ModalDeleteProjectController',
                size : 'md',
                resolve : {
                    items : function() {
                        return {
                            templateUrl : 'views/modal-delete-project.html',
                            data : data
                        };
                    }
                }
            });

            modalInstance.result.then(function(project) {
                self.deleteProject(project).then(function(data) {
                        deffered.resolve(data);
                        $rootScope.setLoading(false);
                        $state.go('success',{type:'project',status:'delete',name:data.Title,id:data.uri}, { location: false });
                    });
            }, function() {

            });
            return deffered.promise;
        }

        /**
         * @ngdoc method
         * @name createProject
         * @methodOf cmsWebApp.service:ManageProjectsService     
         * @param {Object} postData data with post parameters
         * @Description
         * execute create project webservice.
         * @returns {Object} http promise object
         */
        function createProject(postData) {
            return $http.post(WS.createProject, postData).then(function (response) {
                return response.data;
            });

        }
        
        /**
         * @ngdoc method
         * @name updateProject
         * @methodOf cmsWebApp.service:ManageProjectsService     
         * @param {Object} postData data with post parameters
         * @Description
         * execute update project webservice.
         * @returns {Object} http promise object
         */
        function updateProject(postData) {
            postData = _.omit(postData, 'content');
            return $http.put(WS.updateProject, postData).then(function (response) {
                return response.data;
            });
        }
        
        /**
         * @ngdoc method
         * @name deleteProject
         * @methodOf cmsWebApp.service:ManageProjectsService     
         * @param {Object} postData data with post parameters
         * @Description
         * execute delete project webservice.
         * @returns {Object} http promise object
         */
        function deleteProject(postData) {
            postData = _.omit(postData, 'content');
            return $http.post(WS.deleteProject, postData).then(function (response) {
                return response.data;
            });
        }

    }

})();
