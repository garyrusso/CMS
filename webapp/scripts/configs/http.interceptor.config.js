(function() {"use strict";
    /**
     * @ngdoc overview
     * @name cmsWebApp.overview:HttpInterceptorConfig
     * @description
     * Intercepts all http request, response & http errors from the service {@link cmsWebApp.service:httpInterceptor httpInterceptor}
     */
    angular.module('cmsWebApp').config(HttpInterceptorConfig);

    HttpInterceptorConfig.$inject = ['APP_CONFIG', '$httpProvider'];

    function HttpInterceptorConfig(APP_CONFIG, $httpProvider) {
        
        $httpProvider.interceptors.push(httpInterceptor);
        httpInterceptor.$inject = ['$q', '$timeout', 'APP_CONFIG', '$rootScope', '$log', '_'];
        /**
         * @ngdoc service
         * @name cmsWebApp.service:httpInterceptor
         * @description
         * Intercepts all http request, response & http errors of application. If an ajax call to webservice is called by application
         * then before executing call to request first invoke this request interceptor and add all global changes before execution of service.
         * In the same way response & request errors & success are intercepted here.
         */
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
            
            /**
             * @ngdoc method
             * @name httpRequest
             * @methodOf cmsWebApp.service:httpInterceptor
             * @param {Object} httpConfig http object
             * @description 
             * Http request interceptor. Intercept all request made by application.
             * Append baseUrl to all services.
             * Not append baseurl to templates
             * @returns {Object} httpConfig http object
             */
            function httpRequest(httpConfig) {
                if (!checkIsTemplateUrl(httpConfig.url)) {
                    if(httpConfig.url !== 'Security/ValidateUserCredentials') {
                        httpConfig.headers['X-Auth-Token'] = (localStorage && localStorage.getItem('cms.user_details')) ? angular.fromJson(localStorage.getItem('cms.user_details')).authToken : '';
                        httpConfig.headers['X-userSession'] = (localStorage && localStorage.getItem('cms.user_details')) ? angular.fromJson(localStorage.getItem('cms.user_details')).userSession : '';
                    }
                    httpConfig.url = APP_CONFIG.API[APP_CONFIG.environment].baseUrl + httpConfig.url;
                }
                return httpConfig;
            }

            /**
             * @ngdoc method
             * @name httpResponse
             * @methodOf cmsWebApp.service:httpInterceptor
             * @param {Object} http response object
             * @description
             * Http response interceptor. Intercept all response before sending response to application
             * check fakeDelay flag and delay response
             * @returns {Object} promise resolves based on fake delay.
             */
            function httpResponse(response) {
                var defer = $q.defer();
                if (APP_CONFIG.API[APP_CONFIG.environment].fakeDelay && !checkIsTemplateUrl(response.config.url)) {
                    $timeout(function() {
                        defer.resolve(response);
                    }, APP_CONFIG.API[APP_CONFIG.environment].fakeDelayTime);
                } else if (response && response.data && response.data !== 'null'){
                    defer.resolve(response);
                } else {
                    defer.reject(response);
                }

                return defer.promise;
            }
            
            /**
             * @ngdoc method
             * @name httpRequestError
             * @methodOf cmsWebApp.service:httpInterceptor
             * @param {Object} rejection http object
             * @description 
             * Http request error interceptor. Intercept all request error made by application.
             * @returns {Object} rejected http request object
             */
            function httpRequestError(rejection) {
                return rejection;
            }

            /**
             * @ngdoc method
             * @name httpResponseError
             * @methodOf cmsWebApp.service:httpInterceptor
             * @param {Object} rejection http object
             * @description
             * Http response error interceptor. Intercept all response error before sending response error to application.
             * Check the response error status & alert user with resopnse error reasons.
             * @returns {Object} promise
             */
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

            /**
             * @ngdoc method
             * @name checkIsTemplateUrl
             * @methodOf cmsWebApp.service:httpInterceptor
             * @param {String} url http object
             * @description
             * Check the url is having the folder path of templates. No need to add base url of webservice to template urls.
             * As we know angular load templates with ajax call to template. 
             * for example if template url '/views/main.html' is loading for a route then angular execute ajax call to /views/main.html
             * then request intercept intercept & add baseurl to this call also which is not required. So checking whether url has template
             * folder name in url.
             * @returns {Boolean} check true/false 
             */
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
