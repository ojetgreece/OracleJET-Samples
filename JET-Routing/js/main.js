/**
 * Example of Require.js boostrap javascript
 */

requirejs.config({
    // Path mappings for the logical module names
    paths: {
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
    // Shim configurations for modules that do not expose AMD
    shim: {
        'jquery': {
            exports: ['jQuery', '$']
        }
    },
// This section configures the i18n plugin. It is merging the Oracle JET built-in translation
// resources with a custom translation file.
// Any resource file added, must be placed under a directory named "nls". You can use a path mapping or you can define
// a path that is relative to the location of this main.js file.
    config: {
        ojL10n: {
            merge: {
                //'ojtranslations/nls/ojtranslations': 'resources/nls/myTranslations'
            }
        }
    }
});


/**
 * A top-level require call executed by the Application.
 * Although 'ojcore' and 'knockout' would be loaded in any case (they are specified as dependencies
 * by the modules themselves), we are listing them explicitly to get the references to the 'oj' and 'ko'
 * objects in the callback.
 *
 * For a listing of which JET component modules are required for each component, see the specific component
 * demo pages in the JET cookbook.
 */
require(['ojs/ojcore',
    'knockout',
    'jquery',
    'ojs/ojknockout',
    'ojs/ojbutton',
    'ojs/ojtoolbar',
    'ojs/ojmenu',
    'ojs/ojnavigationlist',
    'ojs/ojmodule',
    'ojs/ojrouter',
    'ojs/ojcheckboxset'], // add additional JET component modules as needed
        function (oj, ko, $) // this callback gets executed when all required modules are loaded
        {
            // add any startup code that you want here

            // Retrieve the router static instance and configure the states

            oj.Router.defaults['urlAdapter'] = new oj.Router.urlParamAdapter();
            var router = oj.Router.rootInstance;
            router.configure({
                'books': {
                    label: 'Books',
                    value: 'books',
                    isDefault: true},
                'authors': {
                    label: 'Authors',
                    value: 'authors',
                    isDefault: false},
                'administration': {
                    label: 'Admin',
                    value: 'administration',
                    canEnter: function (params) {
                        if (hvm.admin()[0] === 'admin') {
                            console.log('yes, you may enter the Admin page');
                            return true;
                        } else {
                            console.log('You are not an Admin, go away!');
                            alert("What you talk'n bout Willis?\nAdmin's only!\nGo away!");
                            return false;
                        }
                    },
                    enter: function () {
                        console.log('you have entered the Admin page');

                    },
                    exit: function () {
                        console.log('Thanks for visting the Admin page');
                    }
                }
            });

            function headerViewModel() {
                var self = this;
                self.router = router;
                self.admin = ko.observable("");
            }

            function mainViewModel() {
                var self = this;
                self.router = router;

            }

            var hvm = new headerViewModel();
            var mvm = new mainViewModel();

            oj.Router.sync().then(function () {
                ko.applyBindings(hvm, document.getElementById('header'));
                ko.applyBindings(mvm, document.getElementById('mainContent'));

                //This is used to stop the partial page loading ugliness.
                $('#navBar').show();
            });
        }
);
