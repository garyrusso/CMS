/*
 * @description
 *  Intercepts all http request, response & http errors.
 */
(function() {"use strict";
    angular.module('cmsWebApp').config(HttpInterceptorConfig);

    HttpInterceptorConfig.$inject = ['APP_CONFIG', '$httpProvider'];

    function HttpInterceptorConfig(APP_CONFIG, $httpProvider) {
        $httpProvider.interceptors.push(httpInterceptor);
        httpInterceptor.$inject = ['$q', '$timeout', 'APP_CONFIG', '$rootScope', '$log'];

        function httpInterceptor($q, $timeout, APP_CONFIG, $rootScope, $log) {
            return {
                'request' : httpRequest,
                'response' : httpResponse,
                'requestError' : httpRequestError,
                'responseError' : httpResponseError

            };
            
            //Http request interceptor.
            //append baseUrl to all services.
            //not append baseurl to urls with views/template/uib 
            function httpRequest(httpConfig) {
                if (httpConfig.url.indexOf(APP_CONFIG.viewDir) !== 0 && httpConfig.url.indexOf('directives') !== 0 && httpConfig.url.indexOf('uib') !== 0 && httpConfig.url.indexOf('template') !== 0 && httpConfig.url.indexOf('ng-table') !== 0) {
                    httpConfig.url = APP_CONFIG.API[APP_CONFIG.environment].baseUrl + httpConfig.url;
                }
                return httpConfig;
            }
            
            //Http response interceptor.
            //check fakeDelay flag and delay response 
            function httpResponse(response) {
                var defer = $q.defer();
                if (APP_CONFIG.API[APP_CONFIG.environment].fakeDelay) {
                    $timeout(function() {
                        defer.resolve(response);
                    }, APP_CONFIG.API[APP_CONFIG.environment].fakeDelayTime);

                } else {
                    defer.resolve(response);
                }
                return defer.promise;
            }

            function httpRequestError(rejection) {
                return rejection;
            }

            function httpResponseError(rejection) {
                return rejection;
            }

        }

    }

})();
