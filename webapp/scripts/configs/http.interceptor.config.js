/*
 * @description
 *  Intercepts all http request, response & http errors.
 */
(function() {"use strict";
    angular.module('cmsWebApp').config(HttpInterceptorConfig);

    HttpInterceptorConfig.$inject = ['APP_CONFIG', '$httpProvider'];

    function HttpInterceptorConfig(APP_CONFIG, $httpProvider) {
        $httpProvider.interceptors.push(httpInterceptor);
        httpInterceptor.$inject = ['$q', '$timeout', 'APP_CONFIG', '$rootScope', '$log', '_'];

        function httpInterceptor($q, $timeout, APP_CONFIG, $rootScope, $log, _) {
            // In Angular all templates/views are loaded with ajax call.
            // HTTP Interceptors intercept request & response of templates/views.
            // HTTP Interceptors for templates is not required.
            // So listing all template directories in templateDirectories array for checking.
            var templateDirectories = ['uib', //folder 'uib' is used angularui
            'template', //is a commonly used folder name for many modules
            'ng-table', //folder 'ng-table' is used by 'ng-table' module
            'bootstrap' // bootstrap is used by ui-select
            ];
            templateDirectories.push(APP_CONFIG.viewDir);
            //APP_CONFIG.viewDir is used our app.
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
                if (!checkIsTemplateUrl(httpConfig.url)) {
                    httpConfig.url = APP_CONFIG.API[APP_CONFIG.environment].baseUrl + httpConfig.url;
                }
                return httpConfig;
            }

            //Http response interceptor.
            //check fakeDelay flag and delay response
            function httpResponse(response) {
                var defer = $q.defer();
                if (APP_CONFIG.API[APP_CONFIG.environment].fakeDelay && !checkIsTemplateUrl(response.config.url)) {
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
                var defer = $q.defer();
                defer.reject(rejection);

                var modalContent = {
                    title : 'Webservice: HTTP error, please contact administrator',
                    url : (rejection && rejection.config && rejection.config.url)?rejection.config.url:'',
                    message : (rejection && rejection.data)?rejection.data:'',
                    ok : false,
                    cancel : {
                        text : 'OK',
                        callback : function() {
                        }
                    }
                };

                $rootScope.$broadcast('ShowUserAlert', modalContent);

                return defer.promise;
            }

            //TODO add desc
            function checkIsTemplateUrl(url) {
                var check = false;
                _.map(templateDirectories, function(folderName) {
                    if (url.indexOf(folderName) === 0) {
                        check = true;
                    }
                });

                return check;
            }

        }

    }

})();
