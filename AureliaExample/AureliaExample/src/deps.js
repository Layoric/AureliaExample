/// <reference path='../typings/browser.d.ts'/>
System.register(['aurelia-framework', "aurelia-http-client", 'aurelia-bootstrapper', 'aurelia-templating-binding', 'aurelia-templating-resources', 'aurelia-logging-console', 'aurelia-templating-router'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var aurelia_framework_1, aurelia_http_client_1, aurelia_bootstrapper_1, aurelia_templating_binding_1, aurelia_templating_resources_1, aurelia_logging_console_1, aurelia_templating_router_1;
    var Deps;
    return {
        setters:[
            function (aurelia_framework_1_1) {
                aurelia_framework_1 = aurelia_framework_1_1;
            },
            function (aurelia_http_client_1_1) {
                aurelia_http_client_1 = aurelia_http_client_1_1;
            },
            function (aurelia_bootstrapper_1_1) {
                aurelia_bootstrapper_1 = aurelia_bootstrapper_1_1;
            },
            function (aurelia_templating_binding_1_1) {
                aurelia_templating_binding_1 = aurelia_templating_binding_1_1;
            },
            function (aurelia_templating_resources_1_1) {
                aurelia_templating_resources_1 = aurelia_templating_resources_1_1;
            },
            function (aurelia_logging_console_1_1) {
                aurelia_logging_console_1 = aurelia_logging_console_1_1;
            },
            function (aurelia_templating_router_1_1) {
                aurelia_templating_router_1 = aurelia_templating_router_1_1;
            }],
        execute: function() {
            Deps = (function () {
                function Deps() {
                    var foo = new aurelia_http_client_1.HttpClient();
                    var a = new aurelia_framework_1.Aurelia();
                    var b = aurelia_bootstrapper_1.bootstrap(null);
                    var c = new aurelia_templating_binding_1.TemplatingBindingLanguage();
                    var d = new aurelia_templating_resources_1.NumberRepeatStrategy();
                    var e = new aurelia_logging_console_1.ConsoleAppender();
                    var f = new aurelia_templating_router_1.TemplatingRouteLoader(null);
                }
                return Deps;
            }());
            exports_1("Deps", Deps);
        }
    }
});
//# sourceMappingURL=deps.js.map