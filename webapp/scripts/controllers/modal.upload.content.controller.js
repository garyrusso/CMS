(function() {"use strict";
    /**
     * @ngdoc controller
     * @name cmsWebApp.controller:ModalUploadContentController
     * @description
     * ModalUploadContentController to manage upload Content.
     */
    angular.module('cmsWebApp').controller('ModalUploadContentController', ModalUploadContentController);

    /*Inject angular services to controller*/
    ModalUploadContentController.$inject = ['$rootScope', '$scope', '$uibModalInstance', 'items', '_', '$filter', 'CommonService', '$log', 'ManageProjectsService', '$q', 'getContentSourceResolve', 'getContentPublisherResolve', 'getContentStateResolve', 'getContentSubjectsResolve', 'getContentFileTypeResolve'];

    /*Function ModalUploadContentController*/
    function ModalUploadContentController($rootScope, $scope, $uibModalInstance, items, _, $filter, CommonService, $log, ManageProjectsService, $q, getContentSourceResolve, getContentPublisherResolve, getContentStateResolve, getContentSubjectsResolve, getContentFileTypeResolve) {
        $scope.items = items;
        $rootScope.setLoading(false);
        $scope.data = {
            "ContentUri" : "",
            "Title" : "",
            "Description" : "",
            "Source" : "",
            "Creator" : [''],
            "Publisher" : "",
            "ContentState" : "",
            "Projects" : [''],
            "SubjectHeadings" : [],
            "SubjectKeywords" : [''],
            "SystemId" : "",
            "DateCreated" : "",
            "DateModified" : "",
            "CreatedBy" : "",
            "ModifiedBy" : "",
            "DatePublished" : "",
            "ContentResourceType" : "",
            "FileFormat" : "",
            "FileName" : "",
            "FileSize" : "",
            "FilePath" : ""
        };

        $scope.authToken = CommonService.getItems().authToken;

        $scope.sourceData = [];
        //["Book", "Internet"];
        if (getContentSourceResolve && getContentSourceResolve.results && getContentSourceResolve.results.val) {
            $scope.sourceData = _.pluck(getContentSourceResolve.results.val, 'value');
        }

        $scope.publisherData = [];
        //["Publisher", "Worth Publisher"];
        if (getContentPublisherResolve && getContentPublisherResolve.results && getContentPublisherResolve.results.val) {
            $scope.publisherData = _.pluck(getContentPublisherResolve.results.val, 'value');
        }

        $scope.versionData = [];
        //["Vendor1", "Vendor2"];
        if (getContentStateResolve && getContentStateResolve.results && getContentStateResolve.results.val) {
            $scope.versionData = _.pluck(getContentStateResolve.results.val, 'value');
        }

        $scope.subjectHeadingsData = [];
        //["subject1","subject1"];
        if (getContentSubjectsResolve && getContentSubjectsResolve.results && getContentSubjectsResolve.results.val) {
            $scope.subjectHeadingsData = _.pluck(getContentSubjectsResolve.results.val, 'value');
        }
        
        $scope.fileTypeData = [];
        //["subject1","subject1"];
        if (getContentFileTypeResolve && getContentFileTypeResolve.results && getContentFileTypeResolve.results.val) {
            $scope.fileTypeData = _.map(_.pluck(getContentFileTypeResolve.results.val, 'value'), function(value){
                return value.toLowerCase();
            });
        }

        $scope.ProjectsData = [];

        //Close dialog/modal
        $scope.cancel = closeModalContent;

        //add repeated form elements
        $scope.addRepeatedField = addRepeatedField;

        //search projects
        $scope.searchProject = searchProject;

        //submit functionality
        $scope.submit = submitContent;

        //ng-flow: flow-file-success directive from template call this function once all files are uploaded.
        $scope.uploadCompleted = uploadCompleted;

        //g-flow: flow-files-submitted directive call this function all selected files are ready to upload
        $scope.readytoUpload = readytoUpload;
        
        $scope.failedUpload = failedUpload;
        
        $scope.checkFileType = checkFileType;

        //ng-flow: object to get $files object from flow-name to controller.
        //uploader.flow contains $files object & uploader.flow.upload() can be used to upload files from controller
        $scope.uploader = {};

        //ng-flow: both variables used to resolve once ready to upload & uploaded completed.
        var uploadCompletedDefer = $q.defer(), readytoUploadDefer = $q.defer();

        /**
         * @ngdoc method
         * @name closeModalProject
         * @methodOf cmsWebApp.controller:ModalUploadContentController
         * @description
         * Close dialog/modal
         */
        function closeModalContent() {
            $uibModalInstance.dismiss('cancel');
        }

        /**
         * @ngdoc method
         * @name addRepeatedField
         * @param {Array} dataArray array list with all exsiting elemnets
         * @param {Object} $event event of button plus
         * @methodOf cmsWebApp.controller:ModalUploadContentController
         * @description
         * Close dialog/modal
         */
        function addRepeatedField(dataArray, $event) {
            dataArray.push('');
            $event.preventDefault();
        }

        /**
         * @ngdoc method
         * @name submitContent
         * @methodOf cmsWebApp.controller:ModalUploadContentController
         * @description
         * function for on click of upload button in modal
         */
        function submitContent() {
            $log.debug('submitContent', $scope.uploader.flow, $scope.data);
            $rootScope.setLoading(true);
            $scope.uploader.flow.upload();
            //check whether ng-flow is ready to upload
            readytoUploadDefer.promise.then(function() {
                //check whether upload is completed
                return uploadCompletedDefer.promise;
            }).then(function(response) {
                //"FileFormat": "","FileName": "","FileSize": "","FilePath": ""
                var errorUpload = false;
                _.map($scope.uploader.flow.files, function(eachfile) {
                    if (eachfile.error) {
                        errorUpload = true;
                    }
                });

                if (!errorUpload) {
                    /*_.map($scope.uploader.flow.files, function(eachfile){
                    $scope.data.FileFormat = eachfile.file.name? eachfile.file.name.split('.').pop():'';
                    $scope.data.FileName = eachfile.file.name? eachfile.file.name:'';
                    $scope.data.FileSize = eachfile.file.size? eachfile.file.size:'';
                    $scope.data.FilePath = eachfile.file.webkitRelativePath? eachfile.file.webkitRelativePath:'';

                    });*/
                    //passing data to parent controller.
                    $uibModalInstance.close(angular.copy($scope.data));
                } else {
                    $rootScope.setLoading(false);
                    var modalContent = {
                        title : 'File upload is failed',
                        ok : false,
                        cancel : {
                            text : 'OK',
                            callback : function() {
                            }
                        }
                    };

                    $rootScope.$broadcast('ShowUserAlert', modalContent);
                    closeModalContent();
                }

            }, function(){
                $rootScope.setLoading(false);
                    var modalContent = {
                        title : 'File upload is failed',
                        ok : false,
                        cancel : {
                            text : 'OK',
                            callback : function() {
                            }
                        }
                    };

                    $rootScope.$broadcast('ShowUserAlert', modalContent);
                    closeModalContent();
            });

        }

        /**
         * @ngdoc method
         * @name searchProject
         * @methodOf cmsWebApp.controller:ModalUploadContentController
         * @description
         * search project based on text entered by used in form to select project.
         */
        function searchProject(text) {

            ManageProjectsService.getProjects(text).then(function (response) {
                _.map(response.result, function(project) {
                    var existingTitles = _.pluck($scope.ProjectsData, 'title');
                    //checks whether project title is already added to list.
                    if (!_.contains(existingTitles, project.title)) {
                        $scope.ProjectsData.push(project);
                    }
                });
            });

        }

        /**
         * @ngdoc method
         * @name uploadCompleted
         * @methodOf cmsWebApp.controller:ModalUploadContentController
         * @description
         * ng-flow: flow-file-success directive from template call this function once all files are uploaded.
         * resolve the uploadCompletedDefer object.
         */
        function uploadCompleted() {
            $log.debug('uploadCompleted');
            uploadCompletedDefer.resolve({});
        }
        
        /**
         * @ngdoc method
         * @name failedUpload
         * @methodOf cmsWebApp.controller:ModalUploadContentController
         * @description
         * ng-flow: flow-file-error directive from template, call this function once any of the file is failed to upload.
         * reject the uploadCompletedDefer object.
         */
        function failedUpload(){
            $log.debug('uploadFailed');
            uploadCompletedDefer.reject({});
        }
        
        /**
         * @ngdoc method
         * @name uploadCompleted
         * @methodOf cmsWebApp.controller:ModalUploadContentController
         * @description
         * ng-flow: flow-files-submitted directive call this function all selected files are ready to upload
         */
        function readytoUpload($files, $event, $flow) {
            $log.debug('readytoUpload', $files, $event, $flow);
            readytoUploadDefer.resolve({
                'asdasd' : 1
            });
        }
        
        /**
         * @ngdoc method
         * @name checkFileType
         * @methodOf cmsWebApp.controller:ModalUploadContentController
         * @description
         * ng-flow: flow-file-added directive call this function check the file type before uploading
         */
        function checkFileType(fileExt) {
            return _.contains($scope.fileTypeData, fileExt.toLowerCase());
        }

    }

    //TODO add as a seperate file.
    angular.module('cmsWebApp').directive('validFile', function() {
        return {
            require : 'ngModel',
            link : function(scope, el, attrs, ngModel) {
                ngModel.$render = function() {
                    ngModel.$setViewValue(el.val());
                };

                el.bind('change', function() {
                    scope.$apply(function() {
                        ngModel.$render();
                    });
                });
            }
        };
    });

})();
