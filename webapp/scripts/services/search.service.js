(function() {"use strict";
    /**
     * @ngdoc service
     * @name cmsWebApp.service:SearchService
     * @description
     * search service's purpose is to wrap up search functionality
     */
    angular.module('cmsWebApp').service('SearchService', SearchService);

    /*Inject angular services*/
    SearchService.$inject = ['$log', 'APP_CONFIG', '$http', 'WS'];

    function SearchService($log, APP_CONFIG, $http, WS) {
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
        function searchData(searchType, searchText, pageNumber, pageSize, orderBy, username) {
            $log.debug('SearchService.searchData', searchType, searchText, pageNumber, pageSize, orderBy, username);
            var params = {
                searchType : searchType ? searchType : 'all',//possible values 'project'/'content'/'all'
                searchText : searchText ? searchText : '',
                pageNumber : pageNumber ? parseInt(pageNumber) : 1,
                pageSize : pageSize ? parseInt(pageSize) : APP_CONFIG.limit,
                orderBy : orderBy ? orderBy : '',
                username: username ? username : 'all'
            };

            return $http.get(WS.searchData, {
                params: params
            }).then(function(response) {
                return response.data;
            });
        }

    }

})();
