(function() {"use strict";
    /**
     * @ngdoc controller
     * @name cmsWebApp.controller:SearchController
     * @description
     * SearchController manages all Search functionality
     */
    angular.module('cmsWebApp').controller('SearchController', SearchController);

    /*Inject angular services to controller*/
    SearchController.$inject = ['$log', '$q', '$scope', '$state', '$stateParams', 'NgTableParams', 'APP_CONFIG', 'SearchService', 'CommonService', '_'];

    /*Function SearchController*/
    function SearchController($log, $q, $scope, $state, $stateParams, NgTableParams, APP_CONFIG, SearchService, CommonService, _) {
        $log.debug('SearchController - $stateParams', $stateParams);
        var search = this;
        search.stateParams = angular.copy($stateParams);
        search.searchType = $stateParams.searchType;
        search.searchText = $stateParams.searchText;
        search.sortValues = [{
            name : 'Newest'
        }, {
            name : 'Relevance'
        }, {
            name : 'Oldest'
        }];
        search.sortBy = '';
        search.sortByChnaged = sortByChnaged;
        search.listView = true;
        /* function to toggle list, grid views */
        search.toggleView = toggleView;

        search.viewStateLink = viewStateLink; 

        /* function to change SearchType */
        search.changeSearchType = changeSearchType;
        
        search.showAllFacetsItems = CommonService.showAllFacetsItems;

        search.facetsSelected = [];

        if ($stateParams.facet) {
            if (_.isArray($stateParams.facet)) {
                _.map($stateParams.facet, function(val) {
                    var facetObj = seperateFacetKeyValue(val);
                    if(facetObj) {
                        search.facetsSelected.push(facetObj);
                    }
                });
            } else {
                search.facetsSelected.push(seperateFacetKeyValue($stateParams.facet));
            }
        }
        
        search.prepareFacetUri = prepareFacetUri;
        
        //ng-table col configuration
        search.cols = [{
            field : "title",
            title : "Title",
            sortable : "title",
            sortDirection : "desc"
        }, {
            field : "project",
            data : {
                field: "createdBy",
                title : "Owner",
                sortable: "createdBy",
                sortDirection : "desc"
            }
        }, {
            field : "content",
            data : {
                field : "fileName",
                title : "File Name",
                sortable : "fileName",
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
            field: "modified",
            title : "Date Modified",
            sortable: "modified",
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
                //TODO: search.sortBy ? yet tobe implemented
                SearchService.searchData(search.searchType, search.searchText, pageDetails.page, pageDetails.count, orderBy, '', search.facetsSelected).then(function (response) {
                    $scope.setLoading(false);
                    if (response.results) {
                        params.total(response.results.count);
                        search.facets = CommonService.formatFacets(response.results.facets);
                        defer.resolve(response.results.result);
                    } else {
                        defer.resolve([]);
                    }
                }, function() {
                    defer.resolve([]);
                });
                return defer.promise;
            }
        });

        /**
         * @ngdoc method
         * @name toggleView
         * @methodOf cmsWebApp.controller:SearchController
         * @param {Boolean} viewType listView is true or false.
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
         * @param {Object} searchType searchType
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
        function sortByChnaged() {
            search.tableParams.reload();
        }

        //TODO desc
        function seperateFacetKeyValue(selectedFacet) {
            if (selectedFacet) {
                var facetArr = selectedFacet.split(/:(.+)?/);
                return {
                    facetKey : facetArr[0],
                    facetValue : facetArr[1]
                };
            } else {
                return null;
            }
        }
        
        //TODO desc
        function prepareFacetUri (text) {
            var facetsSelected = angular.copy(search.facetsSelected);
            facetsSelected = _.map(facetsSelected, function(facet){
                return facet.facetKey+':'+facet.facetValue;
            });
            if(!_.contains(facetsSelected, text)) {
                facetsSelected.push(text);
            }
            return facetsSelected;
        }

        //TODO desc
        function viewStateLink(type) {
            type = (type)?type:(search.searchType === 'project')?'project':'content';
            if (type === 'project') {
                type = 'projectview'
            } else {
                type = 'contentview'
            }
            return type;
        }

    }

})();
