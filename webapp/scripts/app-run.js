(function() {"use strict";
    /**
     * @ngdoc run
     * @name cmsWebApp.run:RunBlock
     * @description
     *  get executed after the injector is created and
     *  are used to kickstart the application.
     *  Only instances and constants can be injected into run blocks.
     *  This is to prevent further system configuration during application run time.
     */
    angular.module('cmsWebApp').run(RunBlock);

    RunBlock.$inject = ['APP_CONFIG', '$rootScope', '$state', '$stateParams', '_', '$log', '$httpBackend', 'AuthorizationService'];

    function RunBlock(APP_CONFIG, $rootScope, $state, $stateParams, _, $log, $httpBackend, AuthorizationService) {
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
        $rootScope.$on('onCreateProjectHeader', onCreateProjectHeader);

        $rootScope.$on('$stateChangeStart', stateChangeStart);

        $rootScope.$on('$stateChangeSuccess', stateChangeSuccess);

        $rootScope.$on('$stateChangeError', stateChangeError);

        $rootScope.$on('$locationChangeSuccess', locationChangeSuccess);

        /**
         * @ngdoc method
         * @name onCreateProjectHeader
         * @methodOf cmsWebApp.run:RunBlock
         * @description
         * Broadcast to manage project Cltr to update the table list.
         */
        //TODO check & remove, might not be required.
        function onCreateProjectHeader() {
            $rootScope.$broadcast('createProjectEvent', {});
        }

        /**
         * @ngdoc method
         * @name setLoading
         * @methodOf cmsWebApp.run:RunBlock
         * @param {Boolean} loading whether to show loader or page
         * @description
         * Toggle loader on page.
         */
        function setLoading(loading) {
            $rootScope.isLoading = loading;
        }

        /**
         * @ngdoc method
         * @name stateChangeStart
         * @methodOf cmsWebApp.run:RunBlock
         * @description
         * Changing from one state to another state and immediately invoke this function.
         * Functionality to show loader,check authenciation or authorization..etc can be executed here.
         */
        function stateChangeStart(event, toState, toStateParams) {
            $rootScope.setLoading(true);
            $rootScope.toState = toState;
            $rootScope.toStateParams = toStateParams;

            if (toState && toState.data && toState.data.roles) {
                AuthorizationService.authorize().then(function() {

                }, function() {
                    $rootScope.setLoading(false);
                });
            }

        }

        /**
         * @ngdoc method
         * @name stateChangeSuccess
         * @methodOf cmsWebApp.run:RunBlock
         * @description
         * Changing from one state to another state and when all promises are resolved successfully then finnally invoked
         * Functionality like hide loader ect.. can be added here.
         */
        function stateChangeSuccess() {
            $rootScope.setLoading(false);
        }

        /**
         * @ngdoc method
         * @name stateChangeError
         * @methodOf cmsWebApp.run:RunBlock
         * @description
         * Changing from one state to another state and when any of the promise is rejected then finnally invoked
         * Functionality like display common message when something when wrong when changing from one to another state.
         */
        function stateChangeError() {
            $rootScope.setLoading(false);
        }
        /**
         * @ngdoc method
         * @name locationChangeSuccess
         * @methodOf cmsWebApp.run:RunBlock
         * @description
         * Changing from one url to another url and when all promises are resolved successfully then finnally invoked
         * Functionality like hide loader ect.. can be added here.
         */
        //TODO check & remove if not required
        function locationChangeSuccess() {
            //$rootScope.setLoading(false);
        }

        // Only load mock data, if config says so.
        // Don't add any code related to run block & not related to mock data below if condition
        if (!APP_CONFIG.API[APP_CONFIG.environment].useMocks) {
            return;
        }

        var projectData = {"total":27,"start":1,"page-length":10,"results":[{"systemUID":"d41d8cd98f00b204e9800998ecf8427e","uri":"/projects/project1.xml","path":"fn:doc(\"/projects/project1.xml\")","href":"/v1/documents?uri=%2Fprojects%2Fproject1.xml","mimetype":"application/xml","format":"xml","dateCreated":"2015-04-15 13:30","dateLastModified":"2015-04-15 13:30","username":"bcross","fullName":"Brian Cross","createdBy":"Brian Cross","modifiedBy":"Brian Cross","Title":"Hockenbury 5e-1","description":"Project description","projectState":"Active","subjectHeadings":[{"subjectHeading":"Psychology"},{"subjectHeading":"Biology"}],"subjectKeywords":[{"subjectKeyword":"Psychology"},{"subjectKeyword":"Biology"}],"content":[{"systemUID":"d41d8cd98f00b204e9800998ecf8427e","uri":"/documents/content1.xml","path":"fn:doc(\"/documents/content1.xml\")","href":"/v1/documents?uri=%2Fdocuments%2Fcontent1.xml","mimetype":"application/xml","format":"xml","dateCreated":"2015-04-15 13:30","dateLastModified":"2015-04-15 13:30","username":"bcross","createdBy":"Brian Cross","modifiedBy":"Brian Cross","Title":"Content-1"},{"systemUID":"d41d8cd98f00b204e9800998ecf8427e","uri":"/documents/content2.xml","path":"fn:doc(\"/documents/content2.xml\")","href":"/v1/documents?uri=%2Fdocuments%2Fcontent2.xml","mimetype":"application/xml","format":"xml","dateCreated":"2015-04-15 13:30","dateLastModified":"2015-04-15 13:30","username":"bcross","createdBy":"Brian Cross","modifiedBy":"Brian Cross","Title":"Content-2"}]},{"systemUID":"e41d8cd98f00b204e9800998ecf8427e","uri":"/projects/project2.xml","path":"fn:doc(\"/projects/project1.xml\")","href":"/v1/documents?uri=%2Fprojects%2Fproject2.xml","mimetype":"application/xml","format":"xml","dateCreated":"2015-04-15 13:30","dateLastModified":"2015-04-15 13:30","username":"bcross","fullName":"Brian Cross","createdBy":"Brian Cross","modifiedBy":"Brian Cross","Title":"Hockenbury 5e-2","description":"Project description","projectState":"Active","subjectHeadings":[{"subjectHeading":"Psychology"},{"subjectHeading":"Biology"}],"subjectKeywords":[{"subjectKeyword":"Psychology"},{"subjectKeyword":"Biology"}]},{"systemUID":"x41d8cd98f00b204e9800998ecf3427e","uri":"/projects/project3.xml","path":"fn:doc(\"/projects/project3.xml\")","href":"/v1/documents?uri=%2Fprojects%2Fproject3.xml","mimetype":"application/xml","format":"xml","dateCreated":"2015-04-15 13:30","dateLastModified":"2015-04-15 13:30","username":"bcross","fullName":"Brian Cross","createdBy":"Brian Cross","modifiedBy":"Brian Cross","Title":"Hockenbury 5e-3","description":"Project description","projectState":"Active","subjectHeadings":[{"subjectHeading":"Psychology"},{"subjectHeading":"Biology"}],"subjectKeywords":[{"subjectKeyword":"Psychology"},{"subjectKeyword":"Biology"}]},{"systemUID":"s41d8cd98f00b204e9800998ecf8427e","uri":"/projects/project4.xml","path":"fn:doc(\"/projects/project4.xml\")","href":"/v1/documents?uri=%2Fprojects%2Fproject4.xml","mimetype":"application/xml","format":"xml","dateCreated":"2015-04-15 13:30","dateLastModified":"2015-04-15 13:30","username":"bcross","fullName":"Brian Cross","createdBy":"Brian Cross","modifiedBy":"Brian Cross","Title":"Hockenbury 5e-4","description":"Project description","projectState":"Active","subjectHeadings":[{"subjectHeading":"Psychology"},{"subjectHeading":"Biology"}],"subjectKeywords":[{"subjectKeyword":"Psychology"},{"subjectKeyword":"Biology"}]},{"systemUID":"f45d8cd98f00b204e9800998ecf8427e","uri":"/projects/project5.xml","path":"fn:doc(\"/projects/project5.xml\")","href":"/v1/documents?uri=%2Fprojects%2Fproject5.xml","mimetype":"application/xml","format":"xml","dateCreated":"2015-04-15 13:30","dateLastModified":"2015-04-15 13:30","username":"bcross","fullName":"Brian Cross","createdBy":"Brian Cross","modifiedBy":"Brian Cross","Title":"Hockenbury 5e-5","description":"Project description","projectState":"Active","subjectHeadings":[{"subjectHeading":"Psychology"},{"subjectHeading":"Biology"}],"subjectKeywords":[{"subjectKeyword":"Psychology"},{"subjectKeyword":"Biology"}]},{"systemUID":"j41d8cd98f00b204e9800998ecf8427e","uri":"/projects/project6.xml","path":"fn:doc(\"/projects/project6.xml\")","href":"/v1/documents?uri=%2Fprojects%2Fproject6.xml","mimetype":"application/xml","format":"xml","dateCreated":"2015-04-15 13:30","dateLastModified":"2015-04-15 13:30","username":"bcross","fullName":"Brian Cross","createdBy":"Brian Cross","modifiedBy":"Brian Cross","Title":"Hockenbury 5e-6","description":"Project description","projectState":"Active","subjectHeadings":[{"subjectHeading":"Psychology"},{"subjectHeading":"Biology"}],"subjectKeywords":[{"subjectKeyword":"Psychology"},{"subjectKeyword":"Biology"}]},{"systemUID":"b41d8cd98f00b204e9800998ecf8427e","uri":"/projects/project7.xml","path":"fn:doc(\"/projects/project7.xml\")","href":"/v1/documents?uri=%2Fprojects%2Fproject7.xml","mimetype":"application/xml","format":"xml","dateCreated":"2015-04-15 13:30","dateLastModified":"2015-04-15 13:30","username":"bcross","fullName":"Brian Cross","createdBy":"Brian Cross","modifiedBy":"Brian Cross","Title":"Hockenbury 5e-7","description":"Project description","projectState":"Active","subjectHeadings":[{"subjectHeading":"Psychology"},{"subjectHeading":"Biology"}],"subjectKeywords":[{"subjectKeyword":"Psychology"},{"subjectKeyword":"Biology"}]},{"systemUID":"y41d8cd98f00b204e9800998ecf8427e","uri":"/projects/project8.xml","path":"fn:doc(\"/projects/project8.xml\")","href":"/v1/documents?uri=%2Fprojects%2Fproject8.xml","mimetype":"application/xml","format":"xml","dateCreated":"2015-04-15 13:30","dateLastModified":"2015-04-15 13:30","username":"bcross","fullName":"Brian Cross","createdBy":"Brian Cross","modifiedBy":"Brian Cross","Title":"Hockenbury 5e-8","description":"Project description","projectState":"Active","subjectHeadings":[{"subjectHeading":"Psychology"},{"subjectHeading":"Biology"}],"subjectKeywords":[{"subjectKeyword":"Psychology"},{"subjectKeyword":"Biology"}]},{"systemUID":"v41d8cd98f00b204e9800998ecf8427e","uri":"/projects/project9.xml","path":"fn:doc(\"/projects/project9.xml\")","href":"/v1/documents?uri=%2Fprojects%2Fproject9.xml","mimetype":"application/xml","format":"xml","dateCreated":"2015-04-15 13:30","dateLastModified":"2015-04-15 13:30","username":"bcross","fullName":"Brian Cross","createdBy":"Brian Cross","modifiedBy":"Brian Cross","Title":"Hockenbury 5e-9","description":"Project description","projectState":"Active","subjectHeadings":[{"subjectHeading":"Psychology"},{"subjectHeading":"Biology"}],"subjectKeywords":[{"subjectKeyword":"Psychology"},{"subjectKeyword":"Biology"}]},{"systemUID":"l41d8cd98f00b204e9800998ecf8427e","uri":"/projects/project10.xml","path":"fn:doc(\"/projects/project10.xml\")","href":"/v1/documents?uri=%2Fprojects%2Fproject10.xml","mimetype":"application/xml","format":"xml","dateCreated":"2015-04-15 13:30","dateLastModified":"2015-04-15 13:30","username":"bcross","fullName":"Brian Cross","createdBy":"Brian Cross","modifiedBy":"Brian Cross","Title":"Hockenbury 5e-10","description":"Project description","projectState":"Active","subjectHeadings":[{"subjectHeading":"Psychology"},{"subjectHeading":"Biology"}],"subjectKeywords":[{"subjectKeyword":"Psychology"},{"subjectKeyword":"Biology"}]}],"facets":{"Title":{"type":"xs:string","facetValues":[{"name":"Hockenbury 5e","count":4,"value":"Hockenbury 5e"},{"name":"Hockenbury 5e-1","count":1,"value":"Hockenbury 5e-1"},{"name":"Hockenbury 5e-2","count":1,"value":"Hockenbury 5e-2"},{"name":"Hockenbury 5e-3","count":1,"value":"Hockenbury 5e-3"},{"name":"Hockenbury 5e-4","count":1,"value":"Hockenbury 5e-4"},{"name":"Myers 11e EPUB3","count":1,"value":"Myers 11e EPUB3"}]},"projectState":{"type":"xs:string","facetValues":[{"name":"Active","count":12,"value":"Active"}]},"Subjects":{"type":"xs:string","facetValues":[{"name":"Psychology","count":13,"value":"Psychology"}]},"Keywords":{"type":"xs:string","facetValues":[{"name":"Keyword 1","count":8,"value":"Keyword 1"},{"name":"Keyword 2","count":13,"value":"Keyword 2"},{"name":"Keyword 3","count":23,"value":"Keyword 3"},{"name":"Keyword 4","count":35,"value":"Keyword 4"},{"name":"Keyword 5","count":12,"value":"Keyword 5"},{"name":"Keyword 6","count":7,"value":"Keyword 6"},{"name":"Keyword 7","count":25,"value":"Keyword 7"}]},"query":{"and-query":[{"element-range-query":[{"operator":"=","element":"_1:subjectHeading","value":[{"type":"xs:string","_value":"Psychology"}],"option":"collation=http://marklogic.com/collation/"}],"annotation":[{"operator-ref":"sort","state-ref":"relevance"}]}]}}};

        projectData = angular.fromJson(projectData);

        //Allow templates under views folder to get actual data
        $httpBackend.whenGET(/views\/*/).passThrough();

        //login service
        $httpBackend.whenPOST(/Security/).respond(function(/*method, url, data, headers*/) {
            return [200, {
                "session_token" : "ZTQyMjE4YTdhYTE3OTI4NTljdhYTU0ZTAyNjk2Mg",
                "expires_in" : 3600,
                "token_type" : "bearer",
                "scope" : "user"
            }, {/*headers*/}];
        });

        //Search/list projects 
        $httpBackend.whenGET(/SearchProjects/).respond(function(method, url, data, headers, params) {
            var returnData = {};
            if (!_.isUndefined(params.searchText)) {
                returnData = projectData;
            } else if (!_.isUndefined(params.uri)) {
                returnData = _.chain(projectData.results).find(function(project) {
                    return project.uri === params.uri;
                }).value();
            }
            return [200, returnData, {/*headers*/}];
        });
        
        //get project details
        $httpBackend.whenGET(/GetProjectDetails/).respond(function(method, url, data, headers, params) {
            var returnData = {};
            if (!_.isUndefined(params.searchText)) {
                returnData = projectData;
            } else if (!_.isUndefined(params.uri)) {
                returnData = _.chain(projectData.results).find(function(project) {
                    return project.uri === params.uri;
                }).value();
            }
            return [200, returnData, {/*headers*/}];
        });

        //New project service
        $httpBackend.whenPOST(/CreateProject/).respond(function(method, url, data, headers) {
            projectData.results.unshift(angular.fromJson(data));
            return [200, data];
        });

        //Edit project service
        $httpBackend.whenPUT(/UpdateProject/).respond(function(method, url, data, headers) {
            data = angular.fromJson(data);
            projectData.results = _.map(projectData.results, function(project) {
                if (project.uri === data.uri) {
                    return data;
                }
                return project;
            });
            return [200, data];
        });
        //Delete
        $httpBackend.whenDELETE(/DeleteProject/).respond(function(method, url, data, headers) {
            data = angular.fromJson(data);
            return [200, data];
        });
    }

})();