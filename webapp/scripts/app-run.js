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

    RunBlock.$inject = ['APP_CONFIG', '$rootScope', '$state', '$stateParams', '_', '$log', '$httpBackend', 'AuthorizationService', 'UserAlertService'];

    function RunBlock(APP_CONFIG, $rootScope, $state, $stateParams, _, $log, $httpBackend, AuthorizationService, UserAlertService) {
        // It's very handy to add references to $state and $stateParams to the $rootScope
        // so that you can access them from any scope within your applications.For example,
        // <li ng-class="{ active: $state.includes('contacts.list') }"> will set the <li>
        // to active whenever 'contacts.list' or one of its decendents is active.
        $rootScope.$state = $state;
        $rootScope.$stateParams = $stateParams;
        //isLoading is used to show loader on page
        //set loader true by default.
        $rootScope.isLoading = true;
        
        $rootScope.isListView = true;
        
        $rootScope.setToggleListGridView = setToggleListGridView;

        $rootScope.setLoading = setLoading;

        $rootScope.$on('$stateChangeStart', stateChangeStart);

        $rootScope.$on('$stateChangeSuccess', stateChangeSuccess);

        $rootScope.$on('$stateChangeError', stateChangeError);

        $rootScope.$on('$locationChangeSuccess', locationChangeSuccess);

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
         * @name setToggleListGridView
         * @methodOf cmsWebApp.run:RunBlock
         * @param {Boolean} view whether list or grid
         * @description
         * Switch view from list to grid.
         */
        function setToggleListGridView(view) {
            $rootScope.isListView = view;
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
            //toclear search text.
            $rootScope.$broadcast('stateChange', {
                'state' : toState.name
            });

            AuthorizationService.authorize().then(function() {

            }, function() {
                $rootScope.setLoading(false);
            });

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

        var projectData = {"results":{"status":"Project document found","total":"18","start":"1","count":"10","pageLength":"10","result":[{"uri":"/project/13241274359459920236.xml","systemId":"9a3494485d994fe4a2b44973950e7fc1","projectUri":"","title":"test","description":"Some text","projectState":"active","created":"2016-07-07T07:21:11.82166Z","createdBy":"ghopper","modified":"2016-08-01T14:40:14.814224Z","modifiedBy":"invalid user"},{"uri":"/project/3534955231577682639.xml","systemId":"61ff51df4c11458cb50c6ed5c0e3bd5c","projectUri":"","title":"Test_M2","description":"Create project_Maha2","projectState":"Complete","created":"2016-07-04T12:16:08.886802Z","createdBy":"ghopper","modified":"2016-07-04T12:16:08.886802Z","modifiedBy":"ghopper","subjectHeading":["Biology"],"content":[{"systemId":"3d24b98a49f64b8c82dc5c4aa2bc533e","uri":"/content/8513070159067375216.xml","source":"Book","createdBy":"Grace Hopper","created":"2016-07-18T07:01:07.779627Z","modifiedBy":"Grace Hopper","modified":"2016-07-18T07:01:07.779627Z","projectState":"","title":"zxczxc"},{"systemId":"c7e1fd7de1fc4d6d8415de793096578d","uri":"/content/12475516953987325841.xml","source":"Book","createdBy":"invalid user","created":"2016-07-13T09:29:52.73654Z","modifiedBy":"invalid user","modified":"2016-07-13T09:29:52.73654Z","projectState":"","title":"asd"}]},{"uri":"/project/11646933833969530157.xml","systemId":"f8ff1f4456164b7b98cee114d2e0fe14","projectUri":"","title":"BPS6e","description":"Test BPS6e project edited","projectState":"Inactive","created":"2016-06-30T10:50:03.83556Z","createdBy":"ghopper","modified":"2016-06-30T10:50:03.83556Z","modifiedBy":"ghopper","subjectHeading":["Music & Theater"],"subjectKeyword":["BPS6e","Statistics"],"content":[{"systemId":"2dbe4f375a7f49febec05b6d4190eae7","uri":"/content/17244678608009906793.xml","source":"Course","createdBy":"invalid user","created":"2016-08-01T09:57:03.738967Z","modifiedBy":"invalid user","modified":"2016-08-01T09:57:03.738967Z","projectState":"","title":"56mb2"},{"systemId":"d4298c8786e84e0dbedfe759a75e0f6b","uri":"/content/9976610349291029386.xml","source":"Course","createdBy":"invalid user","created":"2016-08-01T09:57:04.733609Z","modifiedBy":"invalid user","modified":"2016-08-01T09:57:04.733609Z","projectState":"","title":"56mb2"}]},{"uri":"/project/5934051620667869283.xml","systemId":"e76acd416b9c4fa2ac1fca34ad0f7411","projectUri":"","title":"testprojectghopper","description":"testprojectghopper","projectState":"In Progress","created":"2016-07-04T12:36:59.185326Z","createdBy":"ghopper","modified":"2016-07-04T12:36:59.185326Z","modifiedBy":"ghopper","subjectHeading":["Astronomy & Physics"],"subjectKeyword":["testprojectghopper"],"content":[{"systemId":"8f7ba78b561c42daa62cf831af3b561b","uri":"/content/3099297249107360127.xml","source":"Book","createdBy":"Grace Hopper","created":"2016-08-01T15:26:48.82827Z","modifiedBy":"Grace Hopper","modified":"2016-08-01T15:26:48.82827Z","projectState":"","title":"fdas"}]},{"uri":"/project/6695750058062177369.xml","systemId":"c5e4a589c6ba4c789a7ebdb7a6d71398","projectUri":"","title":"Test_Lax","description":"Test_Lax","projectState":"In Progress","created":"2016-07-05T09:20:48.169669Z","createdBy":"ghopper","modified":"2016-07-05T09:20:48.169669Z","modifiedBy":"ghopper","subjectHeading":["Astronomy & Physics"],"subjectKeyword":["LAX","Test_Lax"],"content":[{"systemId":"56fdc0ea10c748acb9c724ab14a147a0","uri":"/content/7038281037093493458.xml","source":"Course","createdBy":"invalid user","created":"2016-08-01T07:46:40.691976Z","modifiedBy":"invalid user","modified":"2016-08-01T07:46:40.691976Z","projectState":"","title":"das"},{"systemId":"9cca8ab6479a4239b5ae1045b2574994","uri":"/content/8288826273741610298.xml","source":"Book","createdBy":"invalid user","created":"2016-08-01T17:18:15.556508Z","modifiedBy":"invalid user","modified":"2016-08-01T17:18:15.556508Z","projectState":"","title":"8MBFILE"},{"systemId":"3ed4c4b115274106b87bde44c7d01fbf","uri":"/content/14271995630264674787.xml","source":"Book","createdBy":"invalid user","created":"2016-07-29T10:40:55.171498Z","modifiedBy":"invalid user","modified":"2016-07-29T10:40:55.171498Z","projectState":"","title":"296360"},{"systemId":"3e05597f311647e58c531f1d791eb792","uri":"/content/5436826481191444677.xml","source":"Book","createdBy":"invalid user","created":"2016-08-01T07:19:05.01521Z","modifiedBy":"invalid user","modified":"2016-08-01T07:19:05.01521Z","projectState":"","title":"fgds"}]},{"uri":"/project/362727489937375176.xml","systemId":"62afac0a4e1341fda224bc0db9c57b23","projectUri":"","title":"11111","description":"11111","projectState":"inactive","created":"2016-07-07T06:49:58.229401Z","createdBy":"ghopper","modified":"2016-07-07T06:49:58.229401Z","modifiedBy":"ghopper","subjectHeading":["Astronomy & Physics"],"content":[{"systemId":"54574f70abbd4e9399dfe2bf498b7662","uri":"/content/8849935075865150370.xml","source":"Book","createdBy":"Grace Hopper","created":"2016-07-29T11:59:01.933948Z","modifiedBy":"Grace Hopper","modified":"2016-07-29T11:59:01.933948Z","projectState":"","title":"morris2e"},{"systemId":"fe18db04aea5418287f51ae2e1384bb3","uri":"/content/4567844536073578537.xml","source":"Book","createdBy":"Grace Hopper","created":"2016-08-01T08:46:46.347343Z","modifiedBy":"Grace Hopper","modified":"2016-08-01T08:46:46.347343Z","projectState":"","title":"lolo"}]},{"uri":"/project/project2.xml","systemId":"d41d8cd98f00b204e9800998ecf1118e","projectUri":"","title":"test edited","description":"sgsdgsdssfsafsaf","projectState":"In Progress","created":"2016-06-30T10:40:46.322225Z","createdBy":"bcross","modified":"2016-06-30T10:40:46.322225Z","modifiedBy":"ghopper","subjectHeading":["History","Revolutionary War"],"subjectKeyword":["EPUB3","EDUPUB","Yorktown"],"content":[{"systemId":"bb67bd5b176e45b4aa002920b6d4505d","uri":"/content/601047818002649059.xml","source":"Book","createdBy":"invalid user","created":"2016-08-01T06:55:11.27632Z","modifiedBy":"invalid user","modified":"2016-08-01T06:55:11.27632Z","projectState":"","title":"dsfa"},{"systemId":"ae848939bd5243fca81c58155f2628d6","uri":"/content/3475266848971506012.xml","source":"Book","createdBy":"invalid user","created":"2016-08-01T15:23:40.426143Z","modifiedBy":"invalid user","modified":"2016-08-01T15:23:40.426143Z","projectState":"","title":"test"},{"systemId":"857e8c6ae7274241891f409dce05a7cf","uri":"/content/10206001249593735358.xml","source":"Book","createdBy":"invalid user","created":"2016-07-29T10:12:58.289405Z","modifiedBy":"invalid user","modified":"2016-07-29T10:12:58.289405Z","projectState":"","title":"303472832bytes"},{"systemId":"92fdad5c4b68434eb820c8692d1c99af","uri":"/content/4167123700308933331.xml","source":"Book","createdBy":"Gary Russo","created":"2016-07-04T09:28:30.508177Z","modifiedBy":"Gary Russo","modified":"2016-07-04T09:28:30.508177Z","projectState":"","title":"adfs"},{"systemId":"33d18f499a1442aa90d3b2f0e5cb85e0","uri":"/content/83530600883408529.xml","source":"Course","createdBy":"invalid user","created":"2016-07-29T10:11:33.642392Z","modifiedBy":"invalid user","modified":"2016-07-29T10:11:33.642392Z","projectState":"","title":"test8436590bytes"},{"systemId":"4bdaf31addbb416f9442b3924e358097","uri":"/content/16622616439726653243.xml","source":"Course","createdBy":"Gary Russo","created":"2016-07-04T07:51:15.864394Z","modifiedBy":"Gary Russo","modified":"2016-07-04T07:51:15.864394Z","projectState":"","title":"adfs"},{"systemId":"e2f63f094c1d4e209ea7e85b7c84d700","uri":"/content/5219204959739685946.xml","source":"Book","createdBy":"Gary Russo","created":"2016-07-04T06:35:00.51543Z","modifiedBy":"Gary Russo","modified":"2016-07-04T06:35:00.51543Z","projectState":"","title":"afds"},{"systemId":"f61285df7fbd447186f7e50006752e3e","uri":"/content/8503150334346262816.xml","source":"Book","createdBy":"invalid user","created":"2016-08-01T15:23:38.708381Z","modifiedBy":"invalid user","modified":"2016-08-01T15:23:38.708381Z","projectState":"","title":"test"},{"systemId":"9abf0f4f04644019b89a7aab71b4d039","uri":"/content/907722542797424664.xml","source":"Book","createdBy":"invalid user","created":"2016-08-01T15:23:39.568762Z","modifiedBy":"invalid user","modified":"2016-08-01T15:23:39.568762Z","projectState":"","title":"test"},{"systemId":"1f83d8e4c7974de497f1d8d924d06075","uri":"/content/9306805568318508118.xml","source":"Course","createdBy":"Gary Russo","created":"2016-07-04T07:51:17.162134Z","modifiedBy":"Gary Russo","modified":"2016-07-04T07:51:17.162134Z","projectState":"","title":"adfs"},{"systemId":"8098c91c078d415e8e67bf1ec9955b8e","uri":"/content/9858477516255133267.xml","source":"Course","createdBy":"Gary Russo","created":"2016-07-04T07:51:13.080109Z","modifiedBy":"Gary Russo","modified":"2016-07-04T07:51:13.080109Z","projectState":"","title":"adfs"}]},{"uri":"/project/8261730680658085105.xml","systemId":"","projectUri":"","title":"test proj","description":"test","projectState":"In Progress","created":"2016-07-14T13:51:06.996566Z","createdBy":"invalid user","modified":"2016-07-14T13:51:06.996566Z","modifiedBy":"invalid user","subjectHeading":["Biochemistry","Biology"],"subjectKeyword":["test"]},{"uri":"/project/13241274359444434373.xml","systemId":"1c379d510d164b9e8a886e2585bc9a05","projectUri":"","title":"Bio2","description":"Bio2","projectState":"Inactive","created":"2016-07-05T09:36:17.542818Z","createdBy":"ghopper","modified":"2016-07-05T09:36:17.542818Z","modifiedBy":"ghopper","subjectHeading":["Biology"],"subjectKeyword":["lakshamanan"]},{"uri":"/project/7366092767152929079.xml","systemId":"7e0766dbca824e1588b598a602d13132","projectUri":"","title":"Test_Create project_Maha","description":"Create project_Maha","projectState":"Inactive","created":"2016-07-04T12:12:55.682477Z","createdBy":"ghopper","modified":"2016-07-04T12:12:55.682477Z","modifiedBy":"ghopper","subjectHeading":["Astronomy & Physics"],"content":[{"systemId":"177d0a86e99c4364a175360158a111e4","uri":"/content/18268668727124920150.xml","source":"Book","createdBy":"Grace Hopper","created":"2016-07-13T09:45:14.285467Z","modifiedBy":"Grace Hopper","modified":"2016-07-13T09:45:14.285467Z","projectState":"","title":"Test-13JUly-test1"}]}],"facets":{"facet":[{"facetName":"Keywords","facetValues":[{"name":"BPS6e","count":"1"},{"name":"Brooklyn","count":"1"},{"name":"EDUPUB","count":"3"},{"name":"EPUB3","count":"3"},{"name":"gsdf sdd","count":"1"},{"name":"july","count":"1"},{"name":"lakshamanan","count":"1"},{"name":"LAX","count":"1"},{"name":"new","count":"1"},{"name":"Statistics","count":"1"},{"name":"stats","count":"1"},{"name":"test","count":"2"},{"name":"Test_Lax","count":"1"},{"name":"Test11","count":"1"},{"name":"testprojectghopper","count":"1"},{"name":"Yorktown","count":"1"}]},{"facetName":"Subjects","facetValues":[{"name":"Astronomy & Physics","count":"7"},{"name":"Biochemistry","count":"1"},{"name":"Biology","count":"3"},{"name":"History","count":"2"},{"name":"Mathematics","count":"1"},{"name":"Music & Theater","count":"2"},{"name":"Philosophy & Religion","count":"1"},{"name":"Psychology","count":"1"},{"name":"Revolutionary War","count":"2"},{"name":"Statistics","count":"1"}]},{"facetName":"Title","facetValues":[{"name":"#","count":"1"},{"name":"11111","count":"1"},{"name":"1776 Battle of Brooklyn","count":"1"},{"name":"Bio2","count":"1"},{"name":"BPS6e","count":"1"},{"name":"demo hari","count":"1"},{"name":"Hockenbury 5e","count":"1"},{"name":"Phil1","count":"1"},{"name":"test edited","count":"1"},{"name":"test proj","count":"1"},{"name":"Test_Create project_Maha","count":"1"},{"name":"Test_Lax","count":"1"},{"name":"Test_Lax1","count":"1"},{"name":"Test_M2","count":"1"},{"name":"Test11","count":"1"},{"name":"Test12","count":"1"},{"name":"testjuly14","count":"1"},{"name":"testprojectghopper","count":"1"}]},{"facetName":"Project State","facetValues":[{"name":"active","count":"1"},{"name":"Complete","count":"3"},{"name":"In Progress","count":"6"},{"name":"inactive","count":"1"},{"name":"Inactive","count":"5"}]}]}}};
        //var projectData = {"total":27,"start":1,"page-length":10,"results":[],"facets":{"Title":{"type":"xs:string","facetValues":[{"name":"Hockenbury 5e","count":4,"value":"Hockenbury 5e"},{"name":"Hockenbury 5e-1","count":1,"value":"Hockenbury 5e-1"},{"name":"Hockenbury 5e-2","count":1,"value":"Hockenbury 5e-2"},{"name":"Hockenbury 5e-3","count":1,"value":"Hockenbury 5e-3"},{"name":"Hockenbury 5e-4","count":1,"value":"Hockenbury 5e-4"},{"name":"Myers 11e EPUB3","count":1,"value":"Myers 11e EPUB3"}]},"projectState":{"type":"xs:string","facetValues":[{"name":"Active","count":12,"value":"Active"}]},"Subjects":{"type":"xs:string","facetValues":[{"name":"Psychology","count":13,"value":"Psychology"}]},"Keywords":{"type":"xs:string","facetValues":[{"name":"Keyword 1","count":8,"value":"Keyword 1"},{"name":"Keyword 2","count":13,"value":"Keyword 2"},{"name":"Keyword 3","count":23,"value":"Keyword 3"},{"name":"Keyword 4","count":35,"value":"Keyword 4"},{"name":"Keyword 5","count":12,"value":"Keyword 5"},{"name":"Keyword 6","count":7,"value":"Keyword 6"},{"name":"Keyword 7","count":25,"value":"Keyword 7"}]},"query":{"and-query":[{"element-range-query":[{"operator":"=","element":"_1:subjectHeading","value":[{"type":"xs:string","_value":"Psychology"}],"option":"collation=http://marklogic.com/collation/"}],"annotation":[{"operator-ref":"sort","state-ref":"relevance"}]}]}}};

        var contentData = {"results":{"status":"Project document found","total":"18","start":"1","count":"10","pageLength":"10","result":[{"uri":"/project/13241274359459920236.xml","systemId":"9a3494485d994fe4a2b44973950e7fc1","projectUri":"","title":"test","description":"Some text","projectState":"active","created":"2016-07-07T07:21:11.82166Z","createdBy":"ghopper","modified":"2016-08-01T14:40:14.814224Z","modifiedBy":"invalid user"},{"uri":"/project/3534955231577682639.xml","systemId":"61ff51df4c11458cb50c6ed5c0e3bd5c","projectUri":"","title":"Test_M2","description":"Create project_Maha2","projectState":"Complete","created":"2016-07-04T12:16:08.886802Z","createdBy":"ghopper","modified":"2016-07-04T12:16:08.886802Z","modifiedBy":"ghopper","subjectHeading":["Biology"],"content":[{"systemId":"3d24b98a49f64b8c82dc5c4aa2bc533e","uri":"/content/8513070159067375216.xml","source":"Book","createdBy":"Grace Hopper","created":"2016-07-18T07:01:07.779627Z","modifiedBy":"Grace Hopper","modified":"2016-07-18T07:01:07.779627Z","projectState":"","title":"zxczxc"},{"systemId":"c7e1fd7de1fc4d6d8415de793096578d","uri":"/content/12475516953987325841.xml","source":"Book","createdBy":"invalid user","created":"2016-07-13T09:29:52.73654Z","modifiedBy":"invalid user","modified":"2016-07-13T09:29:52.73654Z","projectState":"","title":"asd"}]},{"uri":"/project/11646933833969530157.xml","systemId":"f8ff1f4456164b7b98cee114d2e0fe14","projectUri":"","title":"BPS6e","description":"Test BPS6e project edited","projectState":"Inactive","created":"2016-06-30T10:50:03.83556Z","createdBy":"ghopper","modified":"2016-06-30T10:50:03.83556Z","modifiedBy":"ghopper","subjectHeading":["Music & Theater"],"subjectKeyword":["BPS6e","Statistics"],"content":[{"systemId":"2dbe4f375a7f49febec05b6d4190eae7","uri":"/content/17244678608009906793.xml","source":"Course","createdBy":"invalid user","created":"2016-08-01T09:57:03.738967Z","modifiedBy":"invalid user","modified":"2016-08-01T09:57:03.738967Z","projectState":"","title":"56mb2"},{"systemId":"d4298c8786e84e0dbedfe759a75e0f6b","uri":"/content/9976610349291029386.xml","source":"Course","createdBy":"invalid user","created":"2016-08-01T09:57:04.733609Z","modifiedBy":"invalid user","modified":"2016-08-01T09:57:04.733609Z","projectState":"","title":"56mb2"}]},{"uri":"/project/5934051620667869283.xml","systemId":"e76acd416b9c4fa2ac1fca34ad0f7411","projectUri":"","title":"testprojectghopper","description":"testprojectghopper","projectState":"In Progress","created":"2016-07-04T12:36:59.185326Z","createdBy":"ghopper","modified":"2016-07-04T12:36:59.185326Z","modifiedBy":"ghopper","subjectHeading":["Astronomy & Physics"],"subjectKeyword":["testprojectghopper"],"content":[{"systemId":"8f7ba78b561c42daa62cf831af3b561b","uri":"/content/3099297249107360127.xml","source":"Book","createdBy":"Grace Hopper","created":"2016-08-01T15:26:48.82827Z","modifiedBy":"Grace Hopper","modified":"2016-08-01T15:26:48.82827Z","projectState":"","title":"fdas"}]},{"uri":"/project/6695750058062177369.xml","systemId":"c5e4a589c6ba4c789a7ebdb7a6d71398","projectUri":"","title":"Test_Lax","description":"Test_Lax","projectState":"In Progress","created":"2016-07-05T09:20:48.169669Z","createdBy":"ghopper","modified":"2016-07-05T09:20:48.169669Z","modifiedBy":"ghopper","subjectHeading":["Astronomy & Physics"],"subjectKeyword":["LAX","Test_Lax"],"content":[{"systemId":"56fdc0ea10c748acb9c724ab14a147a0","uri":"/content/7038281037093493458.xml","source":"Course","createdBy":"invalid user","created":"2016-08-01T07:46:40.691976Z","modifiedBy":"invalid user","modified":"2016-08-01T07:46:40.691976Z","projectState":"","title":"das"},{"systemId":"9cca8ab6479a4239b5ae1045b2574994","uri":"/content/8288826273741610298.xml","source":"Book","createdBy":"invalid user","created":"2016-08-01T17:18:15.556508Z","modifiedBy":"invalid user","modified":"2016-08-01T17:18:15.556508Z","projectState":"","title":"8MBFILE"},{"systemId":"3ed4c4b115274106b87bde44c7d01fbf","uri":"/content/14271995630264674787.xml","source":"Book","createdBy":"invalid user","created":"2016-07-29T10:40:55.171498Z","modifiedBy":"invalid user","modified":"2016-07-29T10:40:55.171498Z","projectState":"","title":"296360"},{"systemId":"3e05597f311647e58c531f1d791eb792","uri":"/content/5436826481191444677.xml","source":"Book","createdBy":"invalid user","created":"2016-08-01T07:19:05.01521Z","modifiedBy":"invalid user","modified":"2016-08-01T07:19:05.01521Z","projectState":"","title":"fgds"}]},{"uri":"/project/362727489937375176.xml","systemId":"62afac0a4e1341fda224bc0db9c57b23","projectUri":"","title":"11111","description":"11111","projectState":"inactive","created":"2016-07-07T06:49:58.229401Z","createdBy":"ghopper","modified":"2016-07-07T06:49:58.229401Z","modifiedBy":"ghopper","subjectHeading":["Astronomy & Physics"],"content":[{"systemId":"54574f70abbd4e9399dfe2bf498b7662","uri":"/content/8849935075865150370.xml","source":"Book","createdBy":"Grace Hopper","created":"2016-07-29T11:59:01.933948Z","modifiedBy":"Grace Hopper","modified":"2016-07-29T11:59:01.933948Z","projectState":"","title":"morris2e"},{"systemId":"fe18db04aea5418287f51ae2e1384bb3","uri":"/content/4567844536073578537.xml","source":"Book","createdBy":"Grace Hopper","created":"2016-08-01T08:46:46.347343Z","modifiedBy":"Grace Hopper","modified":"2016-08-01T08:46:46.347343Z","projectState":"","title":"lolo"}]},{"uri":"/project/project2.xml","systemId":"d41d8cd98f00b204e9800998ecf1118e","projectUri":"","title":"test edited","description":"sgsdgsdssfsafsaf","projectState":"In Progress","created":"2016-06-30T10:40:46.322225Z","createdBy":"bcross","modified":"2016-06-30T10:40:46.322225Z","modifiedBy":"ghopper","subjectHeading":["History","Revolutionary War"],"subjectKeyword":["EPUB3","EDUPUB","Yorktown"],"content":[{"systemId":"bb67bd5b176e45b4aa002920b6d4505d","uri":"/content/601047818002649059.xml","source":"Book","createdBy":"invalid user","created":"2016-08-01T06:55:11.27632Z","modifiedBy":"invalid user","modified":"2016-08-01T06:55:11.27632Z","projectState":"","title":"dsfa"},{"systemId":"ae848939bd5243fca81c58155f2628d6","uri":"/content/3475266848971506012.xml","source":"Book","createdBy":"invalid user","created":"2016-08-01T15:23:40.426143Z","modifiedBy":"invalid user","modified":"2016-08-01T15:23:40.426143Z","projectState":"","title":"test"},{"systemId":"857e8c6ae7274241891f409dce05a7cf","uri":"/content/10206001249593735358.xml","source":"Book","createdBy":"invalid user","created":"2016-07-29T10:12:58.289405Z","modifiedBy":"invalid user","modified":"2016-07-29T10:12:58.289405Z","projectState":"","title":"303472832bytes"},{"systemId":"92fdad5c4b68434eb820c8692d1c99af","uri":"/content/4167123700308933331.xml","source":"Book","createdBy":"Gary Russo","created":"2016-07-04T09:28:30.508177Z","modifiedBy":"Gary Russo","modified":"2016-07-04T09:28:30.508177Z","projectState":"","title":"adfs"},{"systemId":"33d18f499a1442aa90d3b2f0e5cb85e0","uri":"/content/83530600883408529.xml","source":"Course","createdBy":"invalid user","created":"2016-07-29T10:11:33.642392Z","modifiedBy":"invalid user","modified":"2016-07-29T10:11:33.642392Z","projectState":"","title":"test8436590bytes"},{"systemId":"4bdaf31addbb416f9442b3924e358097","uri":"/content/16622616439726653243.xml","source":"Course","createdBy":"Gary Russo","created":"2016-07-04T07:51:15.864394Z","modifiedBy":"Gary Russo","modified":"2016-07-04T07:51:15.864394Z","projectState":"","title":"adfs"},{"systemId":"e2f63f094c1d4e209ea7e85b7c84d700","uri":"/content/5219204959739685946.xml","source":"Book","createdBy":"Gary Russo","created":"2016-07-04T06:35:00.51543Z","modifiedBy":"Gary Russo","modified":"2016-07-04T06:35:00.51543Z","projectState":"","title":"afds"},{"systemId":"f61285df7fbd447186f7e50006752e3e","uri":"/content/8503150334346262816.xml","source":"Book","createdBy":"invalid user","created":"2016-08-01T15:23:38.708381Z","modifiedBy":"invalid user","modified":"2016-08-01T15:23:38.708381Z","projectState":"","title":"test"},{"systemId":"9abf0f4f04644019b89a7aab71b4d039","uri":"/content/907722542797424664.xml","source":"Book","createdBy":"invalid user","created":"2016-08-01T15:23:39.568762Z","modifiedBy":"invalid user","modified":"2016-08-01T15:23:39.568762Z","projectState":"","title":"test"},{"systemId":"1f83d8e4c7974de497f1d8d924d06075","uri":"/content/9306805568318508118.xml","source":"Course","createdBy":"Gary Russo","created":"2016-07-04T07:51:17.162134Z","modifiedBy":"Gary Russo","modified":"2016-07-04T07:51:17.162134Z","projectState":"","title":"adfs"},{"systemId":"8098c91c078d415e8e67bf1ec9955b8e","uri":"/content/9858477516255133267.xml","source":"Course","createdBy":"Gary Russo","created":"2016-07-04T07:51:13.080109Z","modifiedBy":"Gary Russo","modified":"2016-07-04T07:51:13.080109Z","projectState":"","title":"adfs"}]},{"uri":"/project/8261730680658085105.xml","systemId":"","projectUri":"","title":"test proj","description":"test","projectState":"In Progress","created":"2016-07-14T13:51:06.996566Z","createdBy":"invalid user","modified":"2016-07-14T13:51:06.996566Z","modifiedBy":"invalid user","subjectHeading":["Biochemistry","Biology"],"subjectKeyword":["test"]},{"uri":"/project/13241274359444434373.xml","systemId":"1c379d510d164b9e8a886e2585bc9a05","projectUri":"","title":"Bio2","description":"Bio2","projectState":"Inactive","created":"2016-07-05T09:36:17.542818Z","createdBy":"ghopper","modified":"2016-07-05T09:36:17.542818Z","modifiedBy":"ghopper","subjectHeading":["Biology"],"subjectKeyword":["lakshamanan"]},{"uri":"/project/7366092767152929079.xml","systemId":"7e0766dbca824e1588b598a602d13132","projectUri":"","title":"Test_Create project_Maha","description":"Create project_Maha","projectState":"Inactive","created":"2016-07-04T12:12:55.682477Z","createdBy":"ghopper","modified":"2016-07-04T12:12:55.682477Z","modifiedBy":"ghopper","subjectHeading":["Astronomy & Physics"],"content":[{"systemId":"177d0a86e99c4364a175360158a111e4","uri":"/content/18268668727124920150.xml","source":"Book","createdBy":"Grace Hopper","created":"2016-07-13T09:45:14.285467Z","modifiedBy":"Grace Hopper","modified":"2016-07-13T09:45:14.285467Z","projectState":"","title":"Test-13JUly-test1"}]}],"facets":{"facet":[{"facetName":"Keywords","facetValues":[{"name":"BPS6e","count":"1"},{"name":"Brooklyn","count":"1"},{"name":"EDUPUB","count":"3"},{"name":"EPUB3","count":"3"},{"name":"gsdf sdd","count":"1"},{"name":"july","count":"1"},{"name":"lakshamanan","count":"1"},{"name":"LAX","count":"1"},{"name":"new","count":"1"},{"name":"Statistics","count":"1"},{"name":"stats","count":"1"},{"name":"test","count":"2"},{"name":"Test_Lax","count":"1"},{"name":"Test11","count":"1"},{"name":"testprojectghopper","count":"1"},{"name":"Yorktown","count":"1"}]},{"facetName":"Subjects","facetValues":[{"name":"Astronomy & Physics","count":"7"},{"name":"Biochemistry","count":"1"},{"name":"Biology","count":"3"},{"name":"History","count":"2"},{"name":"Mathematics","count":"1"},{"name":"Music & Theater","count":"2"},{"name":"Philosophy & Religion","count":"1"},{"name":"Psychology","count":"1"},{"name":"Revolutionary War","count":"2"},{"name":"Statistics","count":"1"}]},{"facetName":"Title","facetValues":[{"name":"#","count":"1"},{"name":"11111","count":"1"},{"name":"1776 Battle of Brooklyn","count":"1"},{"name":"Bio2","count":"1"},{"name":"BPS6e","count":"1"},{"name":"demo hari","count":"1"},{"name":"Hockenbury 5e","count":"1"},{"name":"Phil1","count":"1"},{"name":"test edited","count":"1"},{"name":"test proj","count":"1"},{"name":"Test_Create project_Maha","count":"1"},{"name":"Test_Lax","count":"1"},{"name":"Test_Lax1","count":"1"},{"name":"Test_M2","count":"1"},{"name":"Test11","count":"1"},{"name":"Test12","count":"1"},{"name":"testjuly14","count":"1"},{"name":"testprojectghopper","count":"1"}]},{"facetName":"Project State","facetValues":[{"name":"active","count":"1"},{"name":"Complete","count":"3"},{"name":"In Progress","count":"6"},{"name":"inactive","count":"1"},{"name":"Inactive","count":"5"}]}]}}};
        //var contentData = {"total":27,"start":1,"page-length":10,"results":[],"facets":{"projectState":{"type":"xs:string","facetValues":[{"name":"Active","count":12,"value":"Active"},{"name":"","count":1,"value":""}]},"Title":{"type":"xs:string","facetValues":[{"name":"Hockenbury 5e","count":4,"value":"Hockenbury 5e"},{"name":"Hockenbury 5e-1","count":1,"value":"Hockenbury 5e-1"},{"name":"Hockenbury 5e-2","count":1,"value":"Hockenbury 5e-2"},{"name":"Hockenbury 5e-3","count":1,"value":"Hockenbury 5e-3"},{"name":"Hockenbury 5e-4","count":1,"value":"Hockenbury 5e-4"},{"name":"Myers 11e EPUB3","count":1,"value":"Myers 11e EPUB3"}]},"Subjects":{"type":"xs:string","facetValues":[{"name":"Psychology","count":13,"value":"Psychology"}]},"query":{"and-query":[{"element-range-query":[{"operator":"=","element":"_1:subjectHeading","value":[{"type":"xs:string","_value":"Psychology"}],"option":"collation=http://marklogic.com/collation/"}],"annotation":[{"operator-ref":"sort","state-ref":"relevance"}]}]}}};

        projectData = angular.fromJson(projectData);

        //Allow templates under views folder to get actual data
        $httpBackend.whenGET(/views\/*/).passThrough();

        //login service
        $httpBackend.whenPOST(/Security/).respond(function(/*method, url, data, headers*/) {
            return [200, {
                "responseCode" : "200",
                "message" : "Login successful",
                "authToken" : "d9a14ceef9252ba67dcc6001bd9936fe|5/27/2016 1:43:26 PM",
                "username" : "ghopper",
                "fullName" : "Grace Hopper",
                "expiration" : "2016-05-27T13:43:26.561612Z"
            }, {/*headers*/}];
            //return [200, {"responseCode":"401","message":"Username or password is incorrect"}];
        });

        //Search/list projects
        $httpBackend.whenGET(/SearchData/).respond(function(method, url, data, headers, params) {
            var returnData = {};
            if (params.searchType === 'project') {
                returnData = projectData;
            } else {
                returnData = contentData;
            }
            return [200, returnData, {/*headers*/}];
        });

        //Search/list projects
        $httpBackend.whenGET(/SearchProjects/).respond(function(method, url, data, headers, params) {
            var returnData = {};

            returnData = projectData;

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
            returnData = {"systemId":"10eb6841175e4cbfae2dac695cd84b42","projectUri":"","title":"test","description":"testjuly221","created":"2016-07-22T17:55:46.555+05:30","modified":"2016-07-28T19:45:28.834+05:30","createdBy":"Grace Hopper","modifiedBy":"invalid user","projectState":"In Progress","subjectHeading":["Economics"],"subjectKeyword":["s"],"content":[{"systemId":"77ddbfc27fe14dc2909abc921b88b41d","uri":"/content/16676193825033865055.xml","source":"Course","createdBy":"Grace Hopper","created":"2016-07-28T19:34:09.579+05:30","modifiedBy":"Grace Hopper","modified":"2016-07-28T19:34:09.579+05:30","projectState":"","title":"dsaf's \"st\""},{"systemId":"a221f752df4041119b0e09290cd96c5c","uri":"/content/13928434458472683197.xml","source":"Course","createdBy":"Grace Hopper","created":"2016-07-28T19:34:09.598+05:30","modifiedBy":"Grace Hopper","modified":"2016-07-28T19:34:30.431+05:30","projectState":"","title":"dsaf's \"st\" s"}]};
            return [200, returnData, {/*headers*/}];
        });

        //New project service
        $httpBackend.whenPOST(/CreateProject/).respond(function(method, url, data, headers) {
            //projectData.results.unshift(angular.fromJson(data));
            return [200, {results: {status: "Project Successfully Saved: /project/13241274359459920236.xml"}}];
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

        //Get MasterData
        $httpBackend.whenGET(/GetProjectMasterData/).respond(function(method, url, data, headers) {
            return [200, '{"results":[{"name":"In Progress","value":"In Progress"},{"name":"Active","value":"Active"},{"name":"Completed","value":"Completed"},{"name":"Inactive","value":"Inactive"}]}', {/*headers*/}];
            //data = angular.fromJson(data);
            //  return [200, data];
        });

        //Get Content Details
        $httpBackend.whenGET(/GetContentDetails/).respond(function(method, url, data, headers) {
            return [200, {"systemId":"bb67bd5b176e45b4aa002920b6d4505d","created":"2016-08-01T06:55:11.27632Z","modified":"2016-08-01T06:55:11.27632Z","createdBy":"invalid user","modifiedBy":"invalid user","title":"dsfa","description":"dfsa","contentState":"From Vendor","source":"Book","publisher":"BFW High School","datePublished":"","fileFormat":".epub","fileName":"Jacobepub.epub","filePath":"resources/Jacobepub.epub","fileSize":"303472832","subjectHeading":["College Success"],"subjectKeyword":["dfsa"],"auditInfo":{"count":"1","auditEntry":[{"action":"created","dateCreated":"2016-08-01T06:55:11.27632Z","createdBy":"invalid user"}]},"project":[{"uri":"/project/project2.xml","createdBy":"bcross","created":"2016-06-30T10:40:46.322225Z","modifiedBy":"ghopper","modified":"2016-06-30T10:40:46.322225Z","title":""}]}];
        });

        //create content
        $httpBackend.whenPOST(/CreateContent/).respond(function(method, url, data, headers) {
            //contentData.results.unshift(angular.fromJson(data));
            return [200, {"results":{"status":"Content Successfully Saved: /content/7029685112487176549.xml"}}];
        });

        //Delete
        $httpBackend.whenPOST(/DeleteContent/).respond(function(method, url, data, headers) {
            data = angular.fromJson(data);
            return [200, data];
        });

        //UpdateContent
        $httpBackend.whenPUT(/UpdateContent/).respond(function(method, url, data, headers, params) {
            data = angular.fromJson(data);
            return [200, data];
        });

        $httpBackend.whenGET(/SearchContents/).respond(function(method, url, data, headers, params) {
            data = angular.fromJson(data);
            return [200, '{"results":{"status":"content document found","total":"47","start":"1","count":"10","pageLength":"10","result":[{"uri":"/content/601047818002649059.xml","systemId":"bb67bd5b176e45b4aa002920b6d4505d","created":"2016-08-01T06:55:11.27632Z","modified":"2016-08-01T06:55:11.27632Z","createdBy":"invalid user","modifiedBy":"invalid user","title":"dsfa","description":"dfsa","contentState":"From Vendor","projectState":"","source":"Book","publisher":"BFW High School","datePublished":"","fileFormat":".epub","fileName":"Jacobepub.epub","filePath":"resources/Jacobepub.epub","fileSize":"303472832","subjectHeading":["College Success"],"subjectKeyword":["dfsa"]},{"uri":"/content/13746452093661711482.xml","systemId":"e477ffb56c9c4abe88de67cd4f2c4e15","created":"2016-07-13T13:49:44.369343Z","modified":"2016-07-28T09:18:00.747333Z","createdBy":"Grace Hopper","modifiedBy":"invalid user","title":"test2","description":"executionTimeout","contentState":"Initial Review","projectState":"start","source":"Book","publisher":"Bedford/St. Martins","datePublished":"2014-06-10","fileFormat":"EPUB","fileName":"morris2e.epub","filePath":"resources/morris2e.epub","fileSize":"209495471","creator":["Harriot Beechers"],"subjectHeading":["Astronomy & Physics","Biochemistry"],"subjectKeyword":["s"]},{"uri":"/content/17244678608009906793.xml","systemId":"2dbe4f375a7f49febec05b6d4190eae7","created":"2016-08-01T09:57:03.738967Z","modified":"2016-08-01T09:57:03.738967Z","createdBy":"invalid user","modifiedBy":"invalid user","title":"56mb2","description":"56mb","contentState":"Enhanced","projectState":"","source":"Course","publisher":"W.H. Freeman","datePublished":"","fileFormat":".epub","fileName":"56mb.epub","filePath":"resources/56mb.epub","fileSize":"59022874","subjectHeading":["Biochemistry"]},{"uri":"/content/11864684124076117497.xml","systemId":"05b8825669ae9dee519349e4a9edafcb","created":"2016-06-22T10:56:05.032266Z","modified":"2016-06-22T10:56:05.032266Z","createdBy":"webuser","modifiedBy":"webuser","title":"Beechers 21e EPUB3","description":"The EPUB3/EDUPUB of Beechers Cheese 21th Edition Geography textbook.","contentState":"Initial Review","projectState":"","source":"Book","publisher":"Harper Collins","datePublished":"2014-06-10","fileFormat":"EPUB","fileName":"beechers21e.epub","filePath":"s3://cms/beechers21e.epub","fileSize":"35400","creator":["Harriot Beechers"],"subjectHeading":["Geography"],"subjectKeyword":["Hyderabad","Dubai"]},{"uri":"/content/8611187706460102697.xml","systemId":"05b8833669ae9dee519349e4a9aaaaaa111","created":"2016-07-07T04:15:30.259799Z","modified":"2016-07-07T04:15:30.259799Z","createdBy":"Gary Russo","modifiedBy":"Gary Russo","title":"Beechers 21e EPUB3","description":"The EPUB3/EDUPUB of Beechers Cheese 21th Edition Geography textbook.","contentState":"Initial Review","projectState":"start","source":"Book","publisher":"Harper Collins","datePublished":"2014-06-10","fileFormat":"EPUB","fileName":"beechers21e.epub","filePath":"s3://cms/beechers21e.epub","fileSize":"35400","creator":["Harriot Beechers"],"contentResourceType":["Section","Learning Objective"],"subjectHeading":["Geography","Biology"],"subjectKeyword":["Hyderabad","Dubai"]},{"uri":"/content/12753554448228266651.xml","systemId":"96aebd23a6e841e29153c91778314afa","created":"2016-07-05T09:26:37.950314Z","modified":"2016-07-05T09:26:37.950314Z","createdBy":"Gary Russo","modifiedBy":"Gary Russo","title":"Test_Lax_Upload","description":"Test_Lax_Upload","contentState":"Enhanced","projectState":"","source":"Book","publisher":"Bedford/St. Martins","datePublished":"","fileFormat":".5","fileName":"flow-8436590-Jouve-MyersEPCH1epub.5","filePath":"resources/flow-8436590-Jouve-MyersEPCH1epub.5","fileSize":"1048576","creator":["Lakshman"],"subjectHeading":["Astronomy & Physics"]},{"uri":"/content/3475266848971506012.xml","systemId":"ae848939bd5243fca81c58155f2628d6","created":"2016-08-01T15:23:40.426143Z","modified":"2016-08-01T15:23:40.426143Z","createdBy":"invalid user","modifiedBy":"invalid user","title":"test","description":"fds","contentState":"Enhanced","projectState":"","source":"Book","publisher":"Bedford/St. Martins","datePublished":"","fileFormat":".epub","fileName":"morris2e.epub","filePath":"resources/morris2e.epub","fileSize":"209495471","subjectHeading":["Chemistry"],"subjectKeyword":["fdas"]},{"uri":"/content/10206001249593735358.xml","systemId":"857e8c6ae7274241891f409dce05a7cf","created":"2016-07-29T10:12:58.289405Z","modified":"2016-07-29T10:12:58.289405Z","createdBy":"invalid user","modifiedBy":"invalid user","title":"303472832bytes","description":"303472832bytes","contentState":"Enhanced","projectState":"","source":"Book","publisher":"Sapling Learning","datePublished":"","fileFormat":".epub","fileName":"Jacobepub.epub","filePath":"resources/Jacobepub.epub","fileSize":"303472832","creator":["s"],"subjectHeading":["Astronomy & Physics"],"subjectKeyword":["sdf"]},{"uri":"/content/8513070159067375216.xml","systemId":"3d24b98a49f64b8c82dc5c4aa2bc533e","created":"2016-07-18T07:01:07.779627Z","modified":"2016-07-18T07:01:07.779627Z","createdBy":"Grace Hopper","modifiedBy":"Grace Hopper","title":"zxczxc","description":"zxczxc","contentState":"Enhanced","projectState":"","source":"Book","publisher":"PrepU","datePublished":"","fileFormat":".epub","fileName":"demo.epub","filePath":"resources/demo.epub","fileSize":"402814","subjectHeading":["Music & Theater"],"subjectKeyword":["test"]},{"uri":"/content/3099297249107360127.xml","systemId":"8f7ba78b561c42daa62cf831af3b561b","created":"2016-08-01T15:26:48.82827Z","modified":"2016-08-01T15:26:48.82827Z","createdBy":"Grace Hopper","modifiedBy":"Grace Hopper","title":"fdas","description":"fdas","contentState":"Enhanced","projectState":"","source":"Book","publisher":"Sapling Learning","datePublished":"","fileFormat":".epub","fileName":"3.epub","filePath":"resources/3.epub","fileSize":"8436590","subjectHeading":["Biology"]}],"facets":{"facet":[{"facetName":"Keywords","facetValues":[{"name":"adf","count":"3"},{"name":"d","count":"1"},{"name":"dfsa","count":"1"},{"name":"dsa","count":"1"},{"name":"dsaf","count":"2"},{"name":"dsfa","count":"1"},{"name":"Dubai","count":"5"},{"name":"fdas","count":"3"},{"name":"fsdg","count":"1"},{"name":"gggg","count":"1"},{"name":"gjjh","count":"1"},{"name":"Hyderabad","count":"5"},{"name":"mc","count":"2"},{"name":"morris2e","count":"1"},{"name":"s","count":"2"},{"name":"sd","count":"1"},{"name":"sdf","count":"2"},{"name":"test","count":"2"},{"name":"Test-13JUly-test1","count":"1"}]},{"facetName":"Subjects","facetValues":[{"name":"Astronomy & Physics","count":"19"},{"name":"Biochemistry","count":"12"},{"name":"Biology","count":"9"},{"name":"Chemistry","count":"3"},{"name":"College Success","count":"1"},{"name":"Geography","count":"5"},{"name":"Music & Theater","count":"1"},{"name":"Nutrition","count":"1"}]},{"facetName":"Title","facetValues":[{"name":"296360","count":"1"},{"name":"303472832bytes","count":"1"},{"name":"56mb","count":"1"},{"name":"56mb2","count":"2"},{"name":"8MBFILE","count":"1"},{"name":"adfs","count":"4"},{"name":"afds","count":"1"},{"name":"asd","count":"1"},{"name":"Beechers 21e EPUB3","count":"4"},{"name":"Beechers 21e EPUB4","count":"1"},{"name":"das","count":"1"},{"name":"dsfa","count":"1"},{"name":"fdas","count":"1"},{"name":"fgds","count":"1"},{"name":"gggg","count":"1"},{"name":"laks2","count":"2"},{"name":"lolo","count":"1"},{"name":"morris2e","count":"1"},{"name":"test","count":"5"},{"name":"Test_Lax_Upload","count":"7"},{"name":"Test-13JUly-test1","count":"2"},{"name":"test2","count":"4"},{"name":"test8436590bytes","count":"1"},{"name":"uploaded","count":"1"},{"name":"zxczxc","count":"1"}]},{"facetName":"Content State","facetValues":[{"name":"Enhanced","count":"39"},{"name":"From Vendor","count":"2"},{"name":"Initial Review","count":"6"}]}]}}}'];
        });

        //GetDictionary?dictionarytype=publisher&outputformat=json
        $httpBackend.whenGET(/GetDictionary/).respond(function(method, url, data, headers, params) {
            var returnObject = {};
            if (params.dictionarytype === 'Publisher') {
                returnObject = {"results":{"val":[{"name":"bedford_st_martins","value":"Bedford/St. Martins"},{"name":"wh_freeman","value":"W.H. Freeman"},{"name":"worth_publishers","value":"Worth Publishers"},{"name":"sapling_learning","value":"Sapling Learning"},{"name":"late_nite_labs","value":"Late Nite Labs"},{"name":"hayden-mcneil","value":"Hayden-McNeil"},{"name":"prepu","value":"PrepU"},{"name":"dynamic_books","value":"Dynamic Books"},{"name":"bfw_high_school","value":"BFW High School"}]}};
            } else if (params.dictionarytype === 'Source') {
                returnObject = {
                    "results" : {
                        "val" : [{
                            "name" : "book",
                            "value" : "Book"
                        }, {
                            "name" : "internet",
                            "value" : "Internet"
                        }]
                    }
                };
            } else if (params.dictionarytype === 'version-state') {
                returnObject = {
                    "results" : {
                        "val" : [{
                            "name" : "vendor1",
                            "value" : "Vendor1"
                        }, {
                            "name" : "vendor2",
                            "value" : "Vendor2"
                        }]
                    }
                };
            } else if (params.dictionarytype === 'subjectHeadingsData') {
                returnObject = {
                    "results" : {
                        "val" : [{
                            "name" : "subject1",
                            "value" : "Subject1"
                        }, {
                            "name" : "subject2",
                            "value" : "Subject2"
                        }]
                    }
                };
            } else if (params.dictionarytype === 'project-status') {
                returnObject = {
                    "results" : {
                        "val" : [{
                            "name" : "projectstatus1",
                            "value" : "projectstatus1"
                        }, {
                            "name" : "projectstatus2",
                            "value" : "projectstatus2"
                        }]
                    }
                };
            } else if (params.dictionarytype === 'subject-heading') {
                returnObject = {
                    "results" : {
                        "val" : [{
                            "name" : "subject1",
                            "value" : "Subject1"
                        }, {
                            "name" : "subject2",
                            "value" : "Subject2"
                        }]
                    }
                };
            } else if (params.dictionarytype === 'supported-upload-types') {
                returnObject = {
                    "results" : {
                        "val" : [{
                            "name" : "zip",
                            "value" : "zip"
                        }, {
                            "name" : "zip",
                            "value" : "zip"
                        }]
                    }
                };
            }
            return [200, returnObject];
        });
    }

})();
