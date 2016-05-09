/*
 * @description
 *  get executed after the injector is created and
 *  are used to kickstart the application.
 *  Only instances and constants can be injected into run blocks.
 *  This is to prevent further system configuration during application run time.
 */
(function() {"use strict";
    angular.module('cmsWebApp').run(RunBlock);

    RunBlock.$inject = ['APP_CONFIG', '$rootScope', '$state', '$stateParams', '$log', '$httpBackend', 'AuthorizationService'];

    function RunBlock(APP_CONFIG, $rootScope, $state, $stateParams, $log, $httpBackend, AuthorizationService) {
        // It's very handy to add references to $state and $stateParams to the $rootScope
        // so that you can access them from any scope within your applications.For example,
        // <li ng-class="{ active: $state.includes('contacts.list') }"> will set the <li>
        // to active whenever 'contacts.list' or one of its decendents is active.
        $rootScope.$state = $state;
        $rootScope.$stateParams = $stateParams;
        //isLoading is used to show loader on page
        //set loader true by default.
        $rootScope.isLoading = true;

        $rootScope.setLoading = setLoading;

        //TODO move to services instead of event broadcasting.
        $rootScope.$on('rootScopeCreateProjectHeaderOnEvent', rootScopeCreateProjectHeaderOnEvent);

        $rootScope.$on('$stateChangeStart', stateChangeStart);

        $rootScope.$on('$stateChangeSuccess', stateChangeSuccess);

        $rootScope.$on('$stateChangeError', stateChangeError);
        
        $rootScope.$on('$locationChangeSuccess', locationChangeSuccess);

        /*
         * @name rootScopeCreateProjectHeaderOnEvent
         * @description
         *  Broadcast to headerCltr to open modal window with create project form.
         */
        function rootScopeCreateProjectHeaderOnEvent () {
            $rootScope.$broadcast('createProjectHeaderOnEvent', {});
        }

        /*
         * @name setLoading
         * @param {Boolean} loading
         * @description
         *  Toggle loader on page.
         */
        function setLoading (loading) {
            $rootScope.isLoading = loading;
        }

        //TODO add desc
        function stateChangeStart (event, toState, toStateParams) {
            $rootScope.setLoading(true);
            $rootScope.toState = toState;
            $rootScope.toStateParams = toStateParams;
            
            if(toState && toState.data && toState.data.roles) {
                AuthorizationService.authorize().then(function(){
                    $rootScope.setLoading(false);
                });
            }
            
        }

        //TODO add desc
        function stateChangeSuccess () {
            $rootScope.setLoading(false);
        }

        //TODO add desc
        function stateChangeError () {
            $rootScope.setLoading(false);
        }
        
        //TODO add desc
        function locationChangeSuccess () {
            $rootScope.setLoading(false);
        }
        // Only load mock data, if config says so.
        // Don't add any code related to run block & not related to mock data below if condition
        if (!APP_CONFIG.API[APP_CONFIG.environment].useMocks) {
            return;
        }

        //Allow templates under views folder to get actual data
        $httpBackend.whenGET(/views\/*/).passThrough();

        //login service
        $httpBackend.whenPOST(/Security/).respond(function(/*method, url, data, headers*/) {
            return [200, '{"session_token":"ZTQyMjE4YTdhYTE3OTI4NTljdhYTU0ZTAyNjk2Mg","expires_in":3600,"token_type":"bearer","scope":"user"}', {/*headers*/}];
        });
    }

})();
