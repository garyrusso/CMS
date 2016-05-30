/**
 * @ngdoc service
 * @name ManageProjectsService
 * @description
 * ManageProjectsService purpose to monage all project related functionality
 */

(function() {"use strict";
    angular.module('cmsWebApp').service('ManageProjectsService', ManageProjectsService);

    /*Inject angular services*/
    ManageProjectsService.$inject = ['$rootScope', '$q', '_', '$http', '$log', 'APP_CONFIG', '$uibModal', '$state', 'CommonService'];

    function ManageProjectsService($rootScope, $q, _, $http, $log, APP_CONFIG, $uibModal, $state, CommonService) {
        return {
            getProjects : getProjects,
            viewProject : viewProject,
            openProjectModal: openProjectModal,
            openUploadContentModal: openUploadContentModal,
            openDeleteProjectModal : openDeleteProjectModal,
            createProject : createProject,
            updateProject : updateProject,
            deleteProject : deleteProject
        };

        /**
         * @name getProjects
         * @param {String} searchText
         * @param {Integer} pageNumber
         * @param {Integer} pageSize
         * @param {String} orderBy
         * @Description
         * Get all projects based on search criteria
         */
        function getProjects(searchText, pageNumber, pageSize, orderBy) {
            $log.debug('getProjects - ManageProjectsService', searchText, pageNumber, pageSize, orderBy);
            var params = {
                searchText : searchText ? searchText : '',
                pageNumber : pageNumber ? parseInt(pageNumber) : 1,
                pageSize : pageSize ? parseInt(pageSize) : APP_CONFIG.limit,
                orderBy : orderBy ? orderBy : '',
            };

            return $http.get('ManageProjects/SearchProjects', {
                params: params
            }).then(function(response) {
                return response.data;
            });
        }
        
        /**
         * @name viewProject
         * @param {String} uri
         * @Description
         * Get project details based on uri
         */
        function viewProject(uri) {
            $log.debug('viewProject - ManageProjectsService', uri);
            var params = {
                uri : _.isString(uri) ? uri : ''
            };

            return $http.get('ManageProjects/GetProjectDetails', {
                params: params
            }).then(function(response) {
                return response.data;
            });
        }

        /**
         * @name openProjectModal
         * @param {Boolean} editProject - modal is loaded with edit form or new form.
         * @param {Object} data - get data on for edit project
         * @Description
         * open modal window with create/Edit project form
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
        * @name openProjectModal
        * @param {Boolean} editProject - modal is loaded with edit form or new form.
        * @param {Object} data - get data on for edit project
        * @Description
        * open modal window with create/Edit project form
        */
       //TODO check & remove
        function openUploadContentModal(editProject, data) {          
            var self = this, deffered = $q.defer(), modalInstance = $uibModal.open({
                templateUrl: 'views/modal-template.html',
                controller: 'ModalCreateEditProjectController',
                size: 'lg',
                resolve: {
                    items: function () {
                        return {
                            templateUrl: 'views/modal-upload-edit-content.html',
                            edit: editProject,
                            data: data
                        };
                    }
                }
            });

            modalInstance.result.then(function (updatedData) {
                $rootScope.setLoading(true);
                if (editProject) {
                    self.updateProject(updatedData).then(function (data) {
                        deffered.resolve(data);
                        $rootScope.setLoading(false);
                        $state.go('success', { type: 'project', status: 'edit', name: data.Title, id: data.uri }, { location: false });
                    });
                } else {
                    self.createProject(updatedData).then(function (data) {
                        deffered.resolve(data);
                        $rootScope.setLoading(false);
                        $state.go('success', { type: 'project', status: 'new', name: data.Title, id: data.uri }, { location: false });
                    });
                }
            }, function () {

            });

            return deffered.promise;
        }

        /**
         * @name openDeleteProjectModal
         * @param {Object} data - get data on for delete project
         * @Description
         * open modal window with Delete project form
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

        function createProject(postData) {
            return $http.post('ManageProjects/CreateProject', postData).then(function (response) {
                return response.data;
            });

        }

        function updateProject(postData) {
            return $http.put('ManageProjects/UpdateProject', postData).then(function (response) {
                return response.data;
            });
        }
        
        function deleteProject(postData) {
            return $http.post('ManageProjects/DeleteProject', postData).then(function (response) {
                return response.data;
            });
        }

    }

})();
