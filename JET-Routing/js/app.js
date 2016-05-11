/*jslint browser: true*/
/*global define, require */
requirejs.config(
        {
            // Need to set baseUrl or nested view won't work because module location relative to current url.
            // Change to the correct baseUrl when deployed to site like: http://host/myApp
            baseUrl: window.location.href.split('#')[0].substring(0, window.location.href.split('#')[0].lastIndexOf('/')) + '/js',
            paths:
                    {
                        'knockout': '../bower_components/knockout/dist/knockout',
                        'jquery': '../bower_components/jquery/dist/jquery.min',
                        'jqueryui-amd': '../bower_components/jquery-ui/ui',
                        'ojs': '../bower_components/oraclejet/dist/js/libs/oj/debug',
                        'ojL10n': '../bower_components/oraclejet/dist/js/libs/oj/ojL10n',
                        'ojtranslations': '../bower_components/oraclejet/dist/js/libs/oj/resources',
                        'text': '../bower_components/text/text',
                        'promise': '../bower_components/es6-promise/promise.min',
                        'hammerjs': '../bower_components/hammerjs/hammer.min',
                        'signals': '../bower_components/js-signals/dist/signals.min',
                        'ojdnd': '../bower_components/oraclejet/dist/js/libs/dnd-polyfill/dnd-polyfill-1.0.0.min'
                    },
            shim:
                    {
                        'jquery':
                                {
                                    exports: ['jQuery', '$']
                                }
                    }
        });

require(['ojs/ojcore', 'knockout', 'jquery',
    'ojs/ojknockout', 'ojs/ojbutton', 'ojs/ojmenu', 'ojs/ojtoolbar', 'ojs/ojnavigationlist',
    'ojs/ojoffcanvas', 'ojs/ojarraytabledatasource', 'ojs/ojmodule', 'ojs/ojrouter', 'text'],
        function (oj, ko, $)
        {
            'use strict';
            // Set debug mode and log level
            // oj.Assert.forceDebug();
            // oj.Logger.option('level',  oj.Logger.LEVEL_INFO);

            oj.Router.defaults['urlAdapter'] = new oj.Router.urlParamAdapter();

            // Build router configuration array based on metadata used for the toolbar.
            // IMPORTANT: router has to be configured before the first sync!
            function configureRouter(root, metaData)
            {
                var i, item, routerConfig = {};

                for (i = 0; i < metaData.length; i++)
                {
                    item = metaData[i];
                    routerConfig[item.id] = {label: item.name, isDefault: (item.id === 'home')};
                }

                return root.configure(routerConfig);
            }

            // Navigation used for Nav Bar (medium and larger screens) and Nav List (small screens)
            var navData = [
                {
                    name: 'Home', id: 'home'
                },
                {
                    name: 'Customers', id: 'customers'
                },
                {
                    name: 'User', id: 'user'
                }
            ];

            var router = configureRouter(oj.Router.rootInstance, navData);

            function ViewModel()
            {
                var self = this;

                // Application Name used in header
                self.appName = 'Router Demo';

                self.router = router;

                // Media Queries for repsonsive header and navigation
                // Create small screen media query to update nav list orientation and button menu display
                var smQuery = oj.ResponsiveUtils.getFrameworkQuery(oj.ResponsiveUtils.FRAMEWORK_QUERY_KEY.SM_ONLY);
                self.smScreen = oj.ResponsiveKnockoutUtils.createMediaQueryObservable(smQuery);

                self.dataSource = new oj.ArrayTableDataSource(navData, {idAttribute: 'id'});

                self.drawerChange = function (event, data)
                {
                    if (data.option === 'selection' && self.smScreen())
                    {
                        self.toggleDrawer();
                    }
                };

                self.drawerParams =
                        {
                            displayMode: 'push',
                            selector: '#navDrawer'
                        };

                self.toggleDrawer = function ()
                {
                    return oj.OffcanvasUtils.toggle(self.drawerParams);
                };

                // Close the drawer for medium and up screen sizes
                var mdQuery = oj.ResponsiveUtils.getFrameworkQuery(oj.ResponsiveUtils.FRAMEWORK_QUERY_KEY.MD_UP);
                self.mdScreen = oj.ResponsiveKnockoutUtils.createMediaQueryObservable(mdQuery);
                self.mdScreen.subscribe(function () {
                    oj.OffcanvasUtils.close(self.drawerParams);
                });
            }

            oj.Router.sync().then(
                    function ()
                    {
                        ko.applyBindings(new ViewModel(), document.getElementById('page'));
                    },
                    function (error)
                    {
                        oj.Logger.error('Error when starting router: ' + error.message);
                    }
            );
        });