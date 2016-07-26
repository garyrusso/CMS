(function() {"use strict";
    /**
     * @ngdoc service
     * @name cmsWebApp.service:SearchService
     * @description
     * search service's purpose is to wrap up search functionality
     */
    angular.module('cmsWebApp').service('SearchService', SearchService);

    /*Inject angular services*/
    SearchService.$inject = ['$log', 'APP_CONFIG', '$http', 'WS', '_'];

    function SearchService($log, APP_CONFIG, $http, WS, _) {
        $log.debug('SearchService - initialization');
        return {
            searchData : searchData
        };

        /**
         * @ngdoc method
         * @name searchData
         * @methodOf cmsWebApp.service:SearchService
         * @param {String} searchText search text
         * @param {String} pageNumber page number
         * @param {String} pageSize page size
         * @param {String} orderBy order by
         * @param {String} username username
         */
        function searchData(searchType, searchText, pageNumber, pageSize, orderBy, username, facets) {
            $log.debug('SearchService.searchData', searchType, searchText, pageNumber, pageSize, orderBy, username, facets);
            var facetParams = _.map(facets, function (facet) {
                var facetKey = '';
                if (facet.facetKey === 'Keywords') {
                    facetKey = 'keyword';
                } else if (facet.facetKey === 'Subjects') {
                    facetKey = 'heading';
                } else if (facet.facetKey === 'Publisher') {
                    facetKey = 'publisher';
                } else if (facet.facetKey === 'Title') {
                    facetKey = 'title';
                } else if (facet.facetKey === 'Project State') {
                    facetKey = 'state';
                } else if (facet.facetKey === 'Content State') {
                    facetKey = 'state';
                } else {
                    facetKey = facet.facetKey;
                }

                return facetKey + ':' + facet.facetValue;
            });
            var params = {
                searchType : searchType ? searchType : 'all',//possible values 'project'/'content'/'all'
                searchText : searchText ? searchText : '',
                pageNumber : pageNumber ? parseInt(pageNumber) : 1,
                pageSize : pageSize ? parseInt(pageSize) : APP_CONFIG.limit,
                orderBy : orderBy ? orderBy.toLowerCase() : '',
                username: username ? username : 'all',
                facets: facetParams
            };

            return $http.get(WS.searchData, {
                params: params
            }).then(function(response) {
                return response.data;
            });
        }

    }

})();
