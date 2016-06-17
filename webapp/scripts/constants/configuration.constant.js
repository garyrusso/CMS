(function() {"use strict";
    /**
     * @ngdoc overview
     * @name cmsWebApp.overview:APP_CONFIG
     * @description
     * Site configuration are configured here
     * @example
     * APP_CONFIG is injectable as constant (as a service even to .config())
     * <pre>
     * (...)    .config(function (APP_CONFIG) {
     * </pre>
     */
    angular.module('cmsWebApp').constant('APP_CONFIG', {
        viewDir : 'views/',
        limit : 20,
        
        //Set environment here
        environment : 'development',
        API : {
            development : {
                useMocks : false,
                fakeDelay : false,
                fakeDelayTime: 0,//0.8secs
                baseUrl: 'http://localhost:34573/api/',
                debug : true
            },
            developmentLocal : {

                //Set useMocks to true to simulate/mock actual webservice.
                useMocks : true,
                fakeDelay : true,
                fakeDelayTime: 1000,//0.8secs
                baseUrl: 'http://midlayerhost:portNumber/api/',
                debug : true

            },
            qa : {

                //Set useMocks to true to simulate/mock actual webservice.
                useMocks : false,
                fakeDelay : false,
                fakeDelayTime: 0,//0.8secs
                baseUrl : 'http://midlayerhost:portNumber/api/',
                debug : false

            },
            uat : {

                //Set useMocks to true to simulate/mock actual webservice.
                useMocks : false,
                fakeDelay : false,
                fakeDelayTime: 0,//0.8secs
                baseUrl : 'http://midlayerhost:portNumber/api/',
                debug : false

            },
            production : {

                //Set useMocks to true to simulate/mock actual webservice.
                useMocks : false,
                fakeDelay : false,
                fakeDelayTime: 0,//0.8secs
                baseUrl : 'http://midlayerhost:portNumber/api/',
                debug : false

            }

        }
    });
})();
