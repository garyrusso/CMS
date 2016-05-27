/**
 * @ngdoc service
 * @name cmsWebApp.service:ManageContentService
 * @description
 * ManageContentService purpose to monage all content related functionality
 */

(function() {"use strict";
    angular.module('cmsWebApp').service('ManageContentService', ManageContentService);

    /*Inject angular services*/
    ManageContentService.$inject = ['$rootScope', '$q', '_', '$http', '$log', 'APP_CONFIG', '$uibModal', '$state', 'CommonService'];

    function ManageContentService($rootScope, $q, _, $http, $log, APP_CONFIG, $uibModal, $state, CommonService) {
        return {
            getContents : getContents,
            viewContent : viewContent,
            openUploadContentModal: openUploadContentModal,
            openDeleteContentModal : openDeleteContentModal,
            uploadContent : uploadContent,
            updateContent : updateContent,
            deleteContent : deleteContent,            
            openDownloadContentModal : openDownloadContentModal
        };

        /**
         * @ngdoc method
         * @name getContents
         * @methodOf cmsWebApp.service:ManageContentService
         * @param {String} searchText
         * @param {Integer} pageNumber
         * @param {Integer} pageSize
         * @param {String} orderBy
         * @description
         * Get all getContents based on search criteria
         */
        function getContents(searchText, pageNumber, pageSize, orderBy) {
            $log.debug('getContents - ManageContentService', searchText, pageNumber, pageSize, orderBy);
            var params = {
                searchText : searchText ? searchText : '',
                pageNumber : pageNumber ? parseInt(pageNumber) : 1,
                pageSize : pageSize ? parseInt(pageSize) : APP_CONFIG.limit,
                orderBy : orderBy ? orderBy : '',
            };

            return $http.get('ManageContent/getContents', {
                params: params
            }).then(function(response) {
                return response.data;
            });
        }
        
        /**
         * @ngdoc method
         * @name viewContent
         * @methodOf cmsWebApp.service:ManageContentService
         * @param {String} uri
         * @description
         * Get Content details based on uri
         */
        function viewContent(uri) {
            $log.debug('viewContent - ManageContentService', uri);
            var params = {
                uri : _.isString(uri) ? uri : ''
            };

            return $http.get('ManageContent/GetContentDetails', {
                params: params
            }).then(function(response) {
                return response.data;
            });
        }
        
        /**
         * @ngdoc method
         * @name openUploadContentModal
         * @methodOf cmsWebApp.service:ManageContentService
         * @param {Boolean} editContent - modal is loaded with edit form or new form.
         * @param {Object} data - get data on for edit Content
         * @description
         * open modal window with create/Edit Content form
         */
        function openUploadContentModal() {          
            var self = this, deffered = $q.defer(), modalInstance = $uibModal.open({
                templateUrl: 'views/modal-template.html',
                controller: 'ModalUploadContentController',
                size: 'lg',
                resolve: {
                    items: function () {
                        return {
                            templateUrl: 'views/modal-upload-content.html'
                        };
                    },
                    getContentSourceResolve : CommonService.getDictionary('Source'),
                    getContentPublisherResolve : CommonService.getDictionary('Publisher'),
                    getContentStateResolve : CommonService.getDictionary('version-state'),
                    getContentSubjectsResolve : CommonService.getDictionary('subject-heading')
                }
            });
            $rootScope.setLoading(true);
            modalInstance.result.then(function (updatedData) {                
                self.uploadContent(updatedData).then(function (data) {
                    deffered.resolve(data);
                    $rootScope.setLoading(false);
                    $state.go('success', { type: 'content', status: 'new', name: data.Title, id: data.ContentUri }, { location: false });
                });
                
            }, function () {

            });

            return deffered.promise;
        }


/**
         * @ngdoc method
         * @name openDownloadContentModal
         * @methodOf cmsWebApp.service:ManageContentService      
         * @description
         * open modal window with Download Content form
         */
        function openDownloadContentModal() {          
            var self = this, deffered = $q.defer(), modalInstance = $uibModal.open({
                templateUrl: 'views/modal-template.html',
                controller: 'ModalDownloadContentController',
                size: 'lg',
                resolve: {
                    items: function () {
                        return {
                            templateUrl: 'views/modal-download-content.html'
                        };
                    }
                }
            });

            modalInstance.result.then(function (updatedData) {                
                self.downloadContent(updatedData).then(function (data) {
                  //  deffered.resolve(data);
                  //  $rootScope.setLoading(false);
                    $state.go('success', { type: 'Content', status: 'new', name: data.Title, id: data.uri }, { location: false });
                });
                
            }, function () {

            });

            return deffered.promise;
        }


        /**
         * @name openDeleteContentModal
         * @param {Object} data - get data on for delete Content
         * @Description
         * open modal window with Delete Content form
         */
        function openDeleteContentModal (data) {
            var self = this, deffered = $q.defer(), modalInstance = $uibModal.open({
                templateUrl : 'views/modal-template.html',
                controller : 'ModalDeleteContentController',
                size : 'md',
                resolve : {
                    items : function() {
                        return {
                            templateUrl : 'views/modal-delete-content.html',
                            data : data
                        };
                    }
                }
            });

            modalInstance.result.then(function(content) {
                $rootScope.setLoading(true);
                self.deleteContent(content).then(function(data) {
                        deffered.resolve(data);
                        $rootScope.setLoading(false);
                        $state.go('success',{type:'content',status:'delete',name:data.Title,id:data.ContentUri}, { location: false });
                    });
            }, function() {

            });
            return deffered.promise;
        }

        function uploadContent(postData) {
            return $http.post('ManageContent/CreateContent', postData).then(function (response) {
                return response.data;
            });

        }

        function updateContent(postData) {
            return $http.put('ManageContent/UpdateContent', postData).then(function (response) {
                return response.data;
            });
        }
        
        function deleteContent(postData) {
            return $http.post('ManageContent/DeleteContent', postData).then(function (response) {
                return response.data;
            });
        }
        
         function downloadContent(postData) {
            return $http.post('ManageContent/DownloadContent', postData).then(function (response) {
                return response.data;
            });

        }

    }

})();
