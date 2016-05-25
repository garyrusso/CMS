/*
 * Name: CommonService
 * Desc:
 *  All global functionality used in all controllers across the system availaible here.
 */
(function() {"use strict";
    angular.module('cmsWebApp').service('CommonService', CommonService);

    /*Inject angular services*/
    CommonService.$inject = ['$uibModal', '$http'];

    /*  All global functionality used in all controllers across the system availaible here.*/
    function CommonService($uibModal, $http) {
        return {
            showAllFacetsItems : showAllFacetsItems,
            setItems : setItems,
            getItems : getItems,
            getDictionary : getDictionary
        };

        function showAllFacetsItems(facetObj) {
            var modalInstance = $uibModal.open({
                templateUrl : 'views/modal-template.html',
                controller : 'ModalShowAllFacetsItemsController',
                size : 'sm',
                resolve : {
                    items : function() {
                        return {
                            templateUrl : 'views/modal-show-all-facets.html',
                            facetObj : facetObj
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
         * @name CommonService.setItems
         * @param {String}key, {Json Object}value
         * @description
         * Set/save object to session storage
         */
        function setItems(key, value) {
            localStorage.setItem(key, angular.toJson(value));
        }

        /**
         * @name CommonService.getItems
         * @param {String} key
         * @description
         * return json object from session storage.
         */
        function getItems(key) {			
			if(key === 'username') {
				return angular.fromJson(localStorage.getItem('cms.user_details')).username;
			}
            return angular.fromJson(localStorage.getItem(key));
        }
        
        //TODO add desc
        function getDictionary(dictionaryName){
            var params = {
                'dictionarytype': dictionaryName,
                'outputformat': 'json'
            };
            return $http.get('dictionary/GetDictionary', {
                params: params
            }).then(function (response) {
                return response.data;
            });
        }

    }

})();
