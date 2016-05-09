/**
 * @ngdoc service
 * @name ManageProjectsService
 * @description
 * ManageProjectsService purpose to monage all project related functionality
 */

(function() {"use strict";
    angular.module('cmsWebApp').service('ManageProjectsService', ManageProjectsService);

    /*Inject angular services*/
    ManageProjectsService.$inject = ['$rootScope', '$q', '_', '$http', '$log', 'APP_CONFIG', '$uibModal'];

    function ManageProjectsService($rootScope, $q, _, $http, $log, APP_CONFIG, $uibModal) {
        return {
            getProjects : getProjects,
            openProjectModal : openProjectModal,
            createProject : createProject,
            updateProject : updateProject
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
                searchText : _.isString(searchText) ? searchText : '',
                pageNumber : _.isNumber(pageNumber) ? pageNumber : 0,
                pageSize : _.isNumber(pageSize) ? pageSize : APP_CONFIG.limit,
                orderBy : _.isString(orderBy) ? orderBy : '',
            };

            return $http.get('projects', {
                data : params
            }).then(function(response) {
                return response.data;
            });
        }

        /**
         * @name onclickCreateEditProject
         * @param {Boolean} editProject - modal is loaded with edit form or new form.
         * @Description
         * open modal window with create/Edit project form
         */
        function openProjectModal(editProject) {
            var self = this, deffered = $q.defer(), modalInstance = $uibModal.open({
                templateUrl : 'views/modal-template.html',
                controller : 'ModalCreateEditProjectController',
                size : 'lg',
                resolve : {
                    items : function() {
                        return {
                            templateUrl : 'views/modal-create-edit-project.html',
                            edit : editProject
                        };
                    }
                }
            });

            modalInstance.result.then(function(updatedData) {
                $rootScope.setLoading(true);
                if (editProject) {
                    self.updateProject(updatedData).then(function(data) {
                        deffered.resolve(data);
                        $rootScope.setLoading(false);
                    });
                } else {
                    self.createProject(updatedData).then(function(data) {
                        deffered.resolve(data);
                        $rootScope.setLoading(false);
                    });
                }
            }, function() {

            });

            return deffered.promise;
        }

        function createProject(postData) {
            return $http.post('projects', postData).then(function(response) {
                return response.data;
            });

        }

        function updateProject() {
            return $http.put('projects', postData).then(function(response) {
                return response.data;
            });
        }

    }

})();
