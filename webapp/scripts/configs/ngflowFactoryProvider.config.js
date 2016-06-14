(function() {"use strict";
    /**
     * @ngdoc overview
     * @name cmsWebApp.overview:FlowFactoryProvider
     * @description
     * Config FlowFactoryProvider with target url & other settings of ngflow
     */
    angular.module('cmsWebApp').config(FlowFactoryProvider);

    FlowFactoryProvider.$inject = ['flowFactoryProvider', 'APP_CONFIG', 'WS'];

    function FlowFactoryProvider(flowFactoryProvider, APP_CONFIG, WS) {
        flowFactoryProvider.defaults = {
            target : APP_CONFIG.API[APP_CONFIG.environment].baseUrl+WS.uploadFile,//http://localhost:8888/upload.php
            permanentErrors : [404, 500, 501],
            maxChunkRetries : 1,
            chunkRetryInterval : 5000,
            simultaneousUploads : 4
        };
        
        flowFactoryProvider.on('catchAll', function(event) {
            if(APP_CONFIG.API[APP_CONFIG.environment].debug){
                console.log('catchAll', arguments);
            }
            
        });
    }

})(); 