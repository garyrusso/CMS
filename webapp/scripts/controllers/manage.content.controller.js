(function() {"use strict";
    /**
     * @ngdoc controller
     * @name cmsWebApp.controller:ManageContentController
     * @description
     * ManageContentController is controller for content page.
     */
    angular.module('cmsWebApp').controller('ManageContentController', ManageContentController);

    /*Inject angular services to controller*/
    ManageContentController.$inject = ['$log', 'CommonService', 'NgTableParams','routeResolvedContentList', 'ManageContentService'];

    /*Function ManageContentController*/
    function ManageContentController($log, CommonService, NgTableParams, routeResolvedContentList, ManageContentService) {
        $log.debug('ManageContentController');
        var content = this;
        
        content.data = routeResolvedContentList;
        
        content.listView = true;
        
        content.showAllFacetsItems = CommonService.showAllFacetsItems;
        
        /* function to toggle list, grid views */
        content.toggleView = toggleView;
        
        content.onclickUploadContent = onclickUploadContent;
        
        if (content.data && content.data.results && _.isArray(content.data.results)) {
            content.data.results = content.data.results.slice(0, 10);
        }

        if (content.data && content.data.facets) {
            content.facets = _.chain(content.data.facets).omit('query').map(function(value, key) {
                return {
                    facetTitle : key,
                    facetArray : value.facetValues
                };
            }).value();
        }

        content.tableParams = new NgTableParams({
            count : 10
        }, {
            /*counts:[],*/
            data : content.data.results/*.slice(0,10)*/
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
