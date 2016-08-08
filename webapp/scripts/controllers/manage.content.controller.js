(function() {"use strict";
    /**
     * @ngdoc controller
     * @name cmsWebApp.controller:ManageContentController
     * @description
     * ManageContentController is controller for content page.
     */
    angular.module('cmsWebApp').controller('ManageContentController', ManageContentController);

    /*Inject angular services to controller*/
    ManageContentController.$inject = ['$scope', '$log', '$q', 'CommonService', 'NgTableParams', 'ManageContentService', 'SearchService'];

    /*Function ManageContentController*/
    function ManageContentController($scope, $log, $q, CommonService, NgTableParams, ManageContentService, SearchService) {
        $log.debug('ManageContentController');
        var content = this;
        
        content.facets = [];
        
        content.listView = $scope.isListView;
        
        content.showAllFacetsItems = CommonService.showAllFacetsItems;
        
        /* function to toggle list, grid views */
        content.toggleView = toggleView;
        
        content.onclickUploadContent = onclickUploadContent;
        
        //ng-table col configuration
        content.cols = [{
            field : "title",
            title : "Title",
            sortable : false,//"title"
            sortDirection : "desc"
        }, {
            field : "filePath",
            title : "File Name",
            sortable : false,//"filePath"
            sortDirection : "desc"
        }, {
            field: "created",
            title : "Date Created",
            sortable : false,//"dateLastModified"
            sortDirection : "asc"
        }];
        content.sortables = _.indexBy(content.cols, "field");

        content.tableParams = new NgTableParams({
            count : 10
        }, {
            getData: function (params) {
                $log.debug('ManageContentController - params', params);
                var defer = $q.defer();
                $scope.setLoading(true);
                var pageDetails = params.url(), orderBy = params.orderBy()?params.orderBy()[0]:'';
                SearchService.searchData('content', '', pageDetails.page, pageDetails.count, 'Newest').then(function(response){
                //ManageContentService.getContents('', pageDetails.page, pageDetails.count, orderBy).then(function (response) {
                    response = (response && response.results)?response.results:{};
                    $scope.setLoading(false);
                    params.total(response.count);
                    content.facets = CommonService.formatFacets(response.facets);
                    defer.resolve((response.result)?response.result:[]);
                }, function(){
                    defer.resolve([]);
                });
                return defer.promise;
            }
        });
        
        /**
         * @ngdoc method
         * @name toggleView
         * @methodOf cmsWebApp.controller:ManageContentController
         * @param {Boolean} viewType - listView is true or false.
         * @description
         * Switch view from list to grid. if listView is set true then content displayed in table format else in tile view.
         */
        function toggleView(viewType) {
            content.listView = viewType;
            $scope.setToggleListGridView(viewType);
        }
        
        /**
         * @ngdoc method
         * @name onclickUploadContent
         * @methodOf cmsWebApp.controller:ManageContentController
         * @description
         * open modal window with upload content form
         */
        function onclickUploadContent () {
            ManageContentService.openUploadContentModal();
        }

    }

})();
