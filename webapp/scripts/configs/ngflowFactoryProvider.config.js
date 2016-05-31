/**
 * @description
 * Config FlowFactoryProvider 
 */
(function() {"use strict";
    angular.module('cmsWebApp').config(FlowFactoryProvider);

    FlowFactoryProvider.$inject = ['flowFactoryProvider', 'APP_CONFIG'];

    function FlowFactoryProvider(flowFactoryProvider, APP_CONFIG) {
        flowFactoryProvider.defaults = {
            target : APP_CONFIG.API[APP_CONFIG.environment].baseUrl+'ManageContent/UploadFile',//http://localhost:8888/upload.php
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