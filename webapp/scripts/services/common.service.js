(function() {"use strict";
    /**
     * @ngdoc service
     * @name cmsWebApp.service:CommonService
     * @description
     * All global functionality used in all controllers across the system availaible here.
     */
    angular.module('cmsWebApp').service('CommonService', CommonService);

    /*Inject angular services*/
    CommonService.$inject = ['$uibModal', '$http', 'WS', '_'];

    /*  All global functionality used in all controllers across the system availaible here.*/
    function CommonService($uibModal, $http, WS, _) {
        return {
            showAllFacetsItems : showAllFacetsItems,
            setItems : setItems,
            getItems : getItems,
            getDictionary : getDictionary,
            formatFacets : formatFacets,
            extactUriSuccessML : extactUriSuccessML 
        };

        /**
         * @ngdoc method
         * @name showAllFacetsItems
         * @methodOf cmsWebApp.service:CommonService
         * @param {Object} facetObj facet Object
         * @param {String} type search type
         * @description
         * open modal of all facets
         */
        function showAllFacetsItems(facetObj, type) {
            var modalInstance = $uibModal.open({
                templateUrl : 'views/modal-template.html',
                controller : 'ModalShowAllFacetsItemsController',
                size : 'sm',
                resolve : {
                    items : function() {
                        return {
                            templateUrl : 'views/modal-show-all-facets.html',
                            facetObj : facetObj,
                            searchType : type
                        };
                    }
                }
            });

            modalInstance.result.then(function(selectedItem) {
                $scope.selected = selectedItem;
            }, function() {

            });
        }

        /**
         * @ngdoc method
         * @name setItems
         * @methodOf cmsWebApp.service:CommonService
         * @param {String} key key to set 
         * @param {Object} value value object
         * @description
         * Set/save object to session storage
         */
        function setItems(key, value) {
            localStorage.setItem(key, angular.toJson(value));
        }

        /**
         * @ngdoc method
         * @name getItems
         * @methodOf cmsWebApp.service:CommonService
         * @param {String} key if key is username then returns username else userobject
         * @description
         * return json object from session storage.
         */
        function getItems(key) {
            if(key === 'username') {
                return angular.fromJson(localStorage.getItem('cms.user_details')).username;
            }
            key = key?key:'cms.user_details';
            return angular.fromJson(localStorage.getItem(key));
        }
        
        /**
         * @ngdoc method
         * @name getDictionary
         * @methodOf cmsWebApp.service:CommonService
         * @param {String} dictionaryName dictionary Name
         * @description 
         * call dictionary service based on dictionaryname
         */
        function getDictionary(dictionaryName){
            var params = {
                'dictionarytype': dictionaryName,
                'outputformat': 'json'
            };
            return $http.get(WS.getDictionary, {
                params: params
            }).then(function (response) {
                return response.data;
            });
        }
        
        /**
         * @ngdoc method
         * @name formatFacets
         * @methodOf cmsWebApp.service:CommonService
         * @param {Object} facetObject facet Object
         * @description
         * convert facet object to array by omiting query key
         */
        function formatFacets(facetObject) {
            facetObject = (facetObject && facetObject.facet)?facetObject.facet:[];
            return _.chain(angular.copy(facetObject)).map(function(value, key) {
                return (value && value.facetValues)?{
                            facetTitle: value.facetName,
                            facetArray: _.sortBy(value.facetValues, function(facet){
                                return parseInt(facet.count);
                            }).reverse()
                        } : '';
                })
                .compact()
                .value();
        }
        
        /**
         * @ngdoc method
         * @name extactUriSuccessML
         * @methodOf cmsWebApp.service:CommonService
         * @param {Object} successObject success Object returned from Ml service.
         * @description
         * extract/return the uri from string having success message & uri
         * @example
         * Output from service 
         * <pre>
         * {"results":{"status":"Content Successfully Saved: /content/7029685112487176549.xml"}}
         * </pre>
         * @return {String} uri
         */
        function extactUriSuccessML(successObject) {
            successObject = (successObject && successObject.results && successObject.results.status)?successObject.results.status:'';
            return successObject.match(/[\/].*/)[0];
        }
        

    }

})();
