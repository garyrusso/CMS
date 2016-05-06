/*
 * @description
 *  get executed after the injector is created and
 *  are used to kickstart the application.
 *  Only instances and constants can be injected into run blocks.
 *  This is to prevent further system configuration during application run time.
 */
(function() {"use strict";
    angular.module('cmsWebApp').run(RunBlock);

    RunBlock.$inject = ['APP_CONFIG', '$rootScope', '$state', '$stateParams', '$log', '$httpBackend'];

    function RunBlock(APP_CONFIG, $rootScope, $state, $stateParams, $log, $httpBackend) {
        // It's very handy to add references to $state and $stateParams to the $rootScope
        // so that you can access them from any scope within your applications.For example,
        // <li ng-class="{ active: $state.includes('contacts.list') }"> will set the <li>
        // to active whenever 'contacts.list' or one of its decendents is active.
        $rootScope.$state = $state;
        $rootScope.$stateParams = $stateParams;

        //TODO move to services instead of event broadcasting.
        $rootScope.$on('rootScopeCreateProjectHeaderOnEvent', rootScopeCreateProjectHeaderOnEvent);

        function rootScopeCreateProjectHeaderOnEvent() {
            $rootScope.$broadcast('createProjectHeaderOnEvent', {});
        }

        // Only load mock data, if config says so.
        // Don't add any code related to run block & not related to mock data below if condition
        if (!APP_CONFIG.API[APP_CONFIG.environment].useMocks) {
            return;
        }

        //Allow templates under views folder to get actual data
        $httpBackend.whenGET(/views\/*/).passThrough();
        
        //login service
        $httpBackend.whenGET(/checkLogin/).respond(function(/*method, url, data, headers*/) {
            return [200, '{status:true,session_token:"asdasas23423asddfgex"}', {/*headers*/}];
        });
    }

})();
