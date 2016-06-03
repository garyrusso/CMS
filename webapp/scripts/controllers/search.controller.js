(function() {"use strict";
    /**
     * @ngdoc controller
     * @name cmsWebApp.controller:SearchController
     * @description
     * SearchController manages all Search functionality
     */
    angular.module('cmsWebApp').controller('SearchController', SearchController);

    /*Inject angular services to controller*/
    SearchController.$inject = ['$log', '$q', '$scope', '$state', '$stateParams', 'NgTableParams', 'APP_CONFIG', 'SearchService', 'CommonService'];

    /*Function SearchController*/
    function SearchController($log, $q, $scope, $state, $stateParams, NgTableParams, APP_CONFIG, SearchService, CommonService) {
        $log.debug('SearchController - $stateParams', $stateParams);
        var search = this; 
        search.stateParams = angular.copy($stateParams);
        search.searchType = $stateParams.searchType;
        search.searchText = $stateParams.searchText;
        search.sortValues = [{name:'Newest'}, {name:'Relevance'}, {name:'Oldest'}];
        search.sortBy = '';
        search.sortByChnaged = sortByChnaged;
        search.listView = true;
        /* function to toggle list, grid views */
        search.toggleView = toggleView;

        /* function to change SearchType */
        search.changeSearchType = changeSearchType;

        //ng-table col configuration
        search.cols = [{
            field : "Title",
            title : "Title",
            sortable : "Title",
            sortDirection : "desc"
        }, {
            field : "project",
            data : {
                field : "username",
                title : "Owner",
                sortable : "username",
                sortDirection : "desc"
            }
        }, {
            field : "content",
            data : {
                field : "filePath",
                title : "File Name",
                sortable : "filePath",
                sortDirection : "desc"
            }
        }, {
            field : "all",
            data : {
                field : "type",
                title : "Search Type",
                sortable : "type",
                sortDirection : "desc"
            }
        }, {
            field : "dateLastModified",
            title : "Date Modified",
            sortable : "dateLastModified",
            sortDirection : "asc"
        }];
        search.sortables = _.indexBy(search.cols, "field");

        search.tableParams = new NgTableParams({
            count : APP_CONFIG.limit
        }, {
            counts : [10, 20, 50, 100],
            getData : function(params) {
                $log.debug('SearchController - params', params);
                var defer = $q.defer();
                $scope.setLoading(true);
                var pageDetails = params.url(), orderBy = params.orderBy() ? params.orderBy()[0] : '';
                SearchService.searchData(search.searchType, search.searchText, pageDetails.page, pageDetails.count, orderBy, search.sortBy).then(function(response) {
                    $scope.setLoading(false);
                    params.total(response.total);
                    search.facets = CommonService.formatFacets(response.facets);
                    defer.resolve(response.results);
                }, function() {
                    defer.resolve([]);
                });
                return defer.promise;
            }
        });

        /**
         * @ngdoc method
         * @name: toggleView
         * @methodOf cmsWebApp.controller:SearchController
         * @param: {Boolean} viewType listView is true or false.
         * @description
         * Switch view from list to grid. if listView is set true then items will display in table format else in tile view.
         */
        function toggleView(viewType) {
            search.listView = viewType;
        }

        /**
         * @ngdoc method
         * @name changeSearchType
         * @methodOf cmsWebApp.controller:SearchController
         * @param {Object} searchType
         * @description
         * change SearchType
         */
        function changeSearchType(searchType) {
            /*search.searchType = searchType;
            search.tableParams.reload();*/
           search.stateParams.searchType = searchType;
           $state.go('search', search.stateParams);
        }
        
        /**
         * @ngdoc method
         * @name sortByChnaged
         * @methodOf cmsWebApp.controller:SearchController
         * @description
         * change SortBy
         */
        function sortByChnaged(){
            search.tableParams.reload();
        }

    }

})();
