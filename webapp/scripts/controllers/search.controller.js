(function() {"use strict";
    /**
     * @ngdoc controller
     * @name cmsWebApp.controller:SearchController
     * @description
     * SearchController manages all Search functionality
     */
    angular.module('cmsWebApp').controller('SearchController', SearchController);

    /*Inject angular services to controller*/
    SearchController.$inject = ['$log', '$scope', '$stateParams', 'NgTableParams', 'APP_CONFIG', 'ManageProjectsService'];

    /*Function SearchController*/
    function SearchController($log, $scope, $stateParams, NgTableParams, APP_CONFIG, ManageProjectsService) {
        $log.debug('SearchController - $stateParams', $stateParams);
        var search = this;
        search.searchType = $stateParams.searchType;
        search.searchText = $stateParams.searchText;
        search.listView = true;
        /* function to toggle list, grid views */
        search.toggleView = toggleView;

        /* function to change SearchType */
        search.changeSearchType = changeSearchType;
        search.tableParams = new NgTableParams({
            count : APP_CONFIG.limit
        }, {
            counts:[10, 20, 50, 100],
            getData: function (params) {
                $log.debug('SearchController - params', params);
                $scope.setLoading(true);
                var pageDetails = params.url();
                return ManageProjectsService.getProjects(search.searchText, pageDetails.page, pageDetails.count).then(function(response){
                    $scope.setLoading(false);
                    params.total(response.total);
                    return response.results;
                });
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
            search.searchType = searchType;
        }

    }

})();
