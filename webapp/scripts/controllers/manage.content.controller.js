(function() {"use strict";
    /**
     * @ngdoc controller
     * @name cmsWebApp.controller:ManageContentController
     * @description
     * ManageContentController is controller for content page.
     */
    angular.module('cmsWebApp').controller('ManageContentController', ManageContentController);

    /*Inject angular services to controller*/
    ManageContentController.$inject = ['$scope', '$log', 'CommonService', 'NgTableParams', 'ManageContentService', 'SearchService'];

    /*Function ManageContentController*/
    function ManageContentController($scope, $log, CommonService, NgTableParams, ManageContentService, SearchService) {
        $log.debug('ManageContentController');
        var content = this;
        
        content.facets = [];
        
        content.listView = true;
        
        content.showAllFacetsItems = CommonService.showAllFacetsItems;
        
        /* function to toggle list, grid views */
        content.toggleView = toggleView;
        
        content.onclickUploadContent = onclickUploadContent;
        
        //ng-table col configuration
        content.cols = [{
            field : "Title",
            title : "Title",
            sortable : "Title",
            sortDirection : "desc"
        }, {
            field : "filePath",
            title : "File Name",
            sortable : "filePath",
            sortDirection : "desc"
        }, {
            field : "dateLastModified",
            title : "Date Modified",
            sortable : "dateLastModified",
            sortDirection : "asc"
        }];
        content.sortables = _.indexBy(content.cols, "field");

        content.tableParams = new NgTableParams({
            count : 10
        }, {
            getData: function (params) {
                $log.debug('ManageContentController - params', params);
                $scope.setLoading(true);
                var pageDetails = params.url(), orderBy = params.orderBy()?params.orderBy()[0]:'';
                return SearchService.searchData('content', '', pageDetails.page, pageDetails.count, orderBy).then(function(response){
                    $scope.setLoading(false);
                    params.total(response.total);
                    content.facets = CommonService.formatFacets(response.facets);
                    return response.results;
                });
            }
        });
        /**
         * @ngdoc method
         * @name toggleView
         * @param {Boolean} viewType - listView is true or false.
         * @description
         * Switch view from list to grid. if listView is set true then content displayed in table format else in tile view.
         */
        function toggleView(viewType) {
            content.listView = viewType;
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
