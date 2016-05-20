/// <reference path='../typings/browser.d.ts'/>
System.register([], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    function configure(aurelia) {
        aurelia.use
            .standardConfiguration()
            .feature('src/resources')
            .developmentLogging();
        aurelia.start().then(function (x) { return x.setRoot('src/app'); });
    }
    exports_1("configure", configure);
    return {
        setters:[],
        execute: function() {
        }
    }
});
//# sourceMappingURL=main.js.map