/*
 * @ngdoc object
 * @name APP_CONFIG
 * @description
 *  Site configuration are configured here
 * @example
 * APP_CONFIG is injectable as constant (as a service even to .config())
 * <pre>
 * (...)    .config(function (APP_CONFIG) {
 * </pre>
 */

(function() {"use strict";
    angular.module('cmsWebApp').constant('APP_CONFIG', {
        viewDir : 'views/',
        limit : 20,
        
        //Set environment here
        environment : 'development',
        API : {
            development : {

                //Set useMocks to true to simulate/mock actual webservice.
                useMocks : true,
                fakeDelay : true,
                fakeDelayTime: 0,//0.8secs
                baseUrl: 'http://localhost:34573/api/',
                debug : true

            },
            testing : {

                //Set useMocks to true to simulate/mock actual webservice.
                useMocks : true,
                fakeDelay : true,
                fakeDelayTime: 800,//0.8secs
                baseUrl : 'http://midlayerhost/api/v1/',
                debug : false

            },
            production : {

                //Set useMocks to true to simulate/mock actual webservice.
                useMocks : false,
                fakeDelay : false,
                fakeDelayTime: 0,//0.8secs
                baseUrl : 'http://midlayerhost/api/v1/',
                debug : false

            }

        }
    });
})();
