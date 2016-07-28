(function() {"use strict";
    /**
     * @ngdoc service
     * @name cmsWebApp.service:ManageContentService
     * @description
     * ManageContentService purpose to manage all content related functionality
     */
    angular.module('cmsWebApp').service('ManageContentService', ManageContentService);

    /*Inject angular services*/
    ManageContentService.$inject = ['$rootScope', '$q', '_', '$http', '$log', 'APP_CONFIG', '$uibModal', '$state', 'CommonService', 'WS'];

    function ManageContentService($rootScope, $q, _, $http, $log, APP_CONFIG, $uibModal, $state, CommonService, WS) {
        return {
            getContents : getContents,
            viewContent : viewContent,
            openUploadContentModal: openUploadContentModal,
            openDeleteContentModal : openDeleteContentModal,
            uploadContent : uploadContent,
            updateContent : updateContent,
            deleteContent : deleteContent,            
            openDownloadContentModal : openDownloadContentModal,
            downloadContent : downloadContent
        };

        /**
         * @ngdoc method
         * @name getContents
         * @methodOf cmsWebApp.service:ManageContentService
         * @param {String} searchText search text
         * @param {Integer} pageNumber page number
         * @param {Integer} pageSize page size
         * @param {String} orderBy order by 
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

            return $http.get(WS.getContents, {
                params: params
            }).then(function(response) {
                return (response.data && response.data.results) ? response.data.results : {};
            });
        }
        
        /**
         * @ngdoc method
         * @name viewContent
         * @methodOf cmsWebApp.service:ManageContentService
         * @param {String} uri uri
         * @description
         * Get Content details based on uri
         */
        function viewContent(uri) {
            $log.debug('viewContent - ManageContentService', uri);
            var params = {
                uri : _.isString(uri) ? uri : ''
            };

            return $http.get(WS.getContentDetails, {
                params: params
            }).then(function (response) {
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
        function openUploadContentModal(project) {          
            var self = this, deffered = $q.defer(), modalInstance = $uibModal.open({
                templateUrl: 'views/modal-template.html',
                controller: 'ModalUploadContentController',
                size: 'lg',
                resolve: {
                    items: function () {
                        return {
                            templateUrl: 'views/modal-upload-content.html',
                            project: project
                        };
                    },
                    getContentSourceResolve : CommonService.getDictionary('Source'),
                    getContentPublisherResolve : CommonService.getDictionary('Publisher'),
                    getContentStateResolve : CommonService.getDictionary('version-state'),
                    getContentSubjectsResolve : CommonService.getDictionary('subject-heading'),
                    getContentFileTypeResolve: CommonService.getDictionary('supported-upload-types')
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
        function openDownloadContentModal(data) {          
            var self = this, deffered = $q.defer(), modalInstance = $uibModal.open({
                templateUrl: 'views/modal-template.html',
                controller: 'ModalDownloadContentController',
                size: 'lg',
                resolve: {
                    items: function () {
                        return {
                            templateUrl: 'views/modal-download-content.html',
                            data: data
                        };
                    }
                }
            });

            modalInstance.result.then(function (updatedData) {  
                window.location.href = APP_CONFIG.API[APP_CONFIG.environment].baseUrl + WS.downloadContent + '?uri=' + updatedData.filePath;
            }, function () {

            });

            return deffered.promise;
        }


        /**
         * @ngdoc method
         * @name openDeleteContentModal
         * @methodOf cmsWebApp.service:ManageContentService     
         * @param {Object} data - get data for delete Content
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
        
        /**
         * @ngdoc method
         * @name uploadContent
         * @methodOf cmsWebApp.service:ManageContentService     
         * @param {Object} postData data with post parameters
         * @Description
         * execute upload content webservice.
         * @returns {Object} http promise object
         */
        function uploadContent(postData) {
            return $http.post(WS.createContent, postData).then(function (response) {
                return response.data;
            });

        }
        
        /**
         * @ngdoc method
         * @name updateContent
         * @methodOf cmsWebApp.service:ManageContentService     
         * @param {Object} postData data with post parameters
         * @Description
         * execute update content webservice.
         * @returns {Object} http promise object
         */
        function updateContent(postData) {
            return $http.put(WS.updateContent, postData).then(function (response) {
                return response.data;
            });
        }
        
        /**
         * @ngdoc method
         * @name deleteContent
         * @methodOf cmsWebApp.service:ManageContentService     
         * @param {Object} postData data with post parameters
         * @Description
         * execute delete content webservice.
         * @returns {Object} http promise object
         */
        function deleteContent(postData) {

            return $http.post(WS.deleteContent, { "ContentUri": postData.ContentUri }).then(function (response) {
                return response.data;
            });
        }
        
        /**
         * @ngdoc method
         * @name downloadContent
         * @methodOf cmsWebApp.service:ManageContentService     
         * @param {Object} postData data with post parameters
         * @Description
         * execute download content webservice.
         * @returns {Object} http promise object
         */
        function downloadContent(postData) {
            return $http.get(WS.downloadContent, {params:postData}).then(function (response) {
                return response.data;
            });

        }

    }

})();
