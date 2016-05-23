/**
 * @ngdoc service
 * @name cmsWebApp.service:SearchService
 * @description
 * search service's purpose is to wrap up search functionality
 */

(function() {"use strict";
    angular.module('cmsWebApp').service('SearchService', SearchService);

    /*Inject angular services*/
    SearchService.$inject = ['$log', 'APP_CONFIG', '$http'];

    function SearchService($log, APP_CONFIG, $http) {
        $log.debug('SearchService - initialization');
        return {
            searchData : searchData
        };

        /**
         * @ngdoc method
         * @name searchData
         * @methodOf cmsWebApp.service:SearchService
         * @param {String} searchText
         * @param {String} pageNumber
         * @param {String} pageSize
         * @param {String} orderBy
         * @param {String} username
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

            return $http.get('SearchData', {
                params: params
            }).then(function(response) {
                return response.data;
            });
        }

    }

})();
