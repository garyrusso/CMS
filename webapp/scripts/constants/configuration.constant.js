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
            //Configure development 
            development : {
                useMocks : false,
                fakeDelay : false,
                fakeDelayTime: 0,//0.8secs
                baseUrl: 'http://localhost:34573/api/',
                debug : true
            },
            //Configure developmentLocal 
            developmentLocal : {

                //Set useMocks to true to simulate/mock actual webservice.
                useMocks : true,
                fakeDelay : true,
                fakeDelayTime: 1000,//0.8secs
                baseUrl: 'http://midlayerhost/api/',
                debug : true

            },
            //Configure qa 
            qa : {

                //Set useMocks to true to simulate/mock actual webservice.
                useMocks : false,
                fakeDelay : false,
                fakeDelayTime: 0,//0.8secs
                baseUrl : 'http://midlayerhost:portNumber/api/',
                debug : false

            },
            //Configure uat
            uat : {

                //Set useMocks to true to simulate/mock actual webservice.
                useMocks : false,
                fakeDelay : false,
                fakeDelayTime: 0,//0.8secs
                baseUrl : 'http://midlayerhost:portNumber/api/',
                debug : false

            },
            //Configure production
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
