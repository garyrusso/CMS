(function() {"use strict";
    /*
     * @ngdoc overview
     * @name cmsWebApp.overview:WS
     * @description
     * All webservices are listed here
     * @example
     * WS is injectable as constant (as a service even to .config())
     * <pre>
     * (...)    .config(function (WS) {
     * </pre>
     */
    angular.module('cmsWebApp').constant('WS', {
        'authenticateUser' : 'Security/ValidateUserCredentials',
        'getDictionary' : 'dictionary/GetDictionary',
        'getContents' : 'ManageContent/SearchContents',
        'getContentDetails' : 'ManageContent/GetContentDetails',
        'createContent' : 'ManageContent/CreateContent',
        'updateContent' : 'ManageContent/UpdateContent',
        'deleteContent': 'ManageContent/DeleteContent',
        'downloadContent' : 'ManageContent/DownloadContent',
        'searchProjects' :'ManageProjects/SearchProjects',
        'getProjectDetails' : 'ManageProjects/GetProjectDetails',
        'createProject' : 'ManageProjects/CreateProject',
        'updateProject' : 'ManageProjects/UpdateProject',
        'deleteProject' : 'ManageProjects/DeleteProject',
        'searchData' : 'SearchData',
        'uploadFile' : 'ManageContent/UploadFile'
    });
})();
