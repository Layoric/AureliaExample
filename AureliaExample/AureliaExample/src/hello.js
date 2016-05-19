System.register(["aurelia-framework", "aurelia-http-client"], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
        else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    var __metadata = (this && this.__metadata) || function (k, v) {
        if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
    };
    var aurelia_framework_1, aurelia_http_client_1;
    var HelloCustomElement;
    return {
        setters:[
            function (aurelia_framework_1_1) {
                aurelia_framework_1 = aurelia_framework_1_1;
            },
            function (aurelia_http_client_1_1) {
                aurelia_http_client_1 = aurelia_http_client_1_1;
            }],
        execute: function() {
            HelloCustomElement = (function () {
                function HelloCustomElement(httpClient) {
                    this.httpClient = httpClient;
                    this.httpClient.configure(function (config) {
                        config.withHeader('Accept', 'application/json');
                    });
                }
                HelloCustomElement.prototype.nameChanged = function (newValue) {
                    var _this = this;
                    if (newValue.length > 0) {
                        this.httpClient.get('/hello/' + newValue).then(function (response) {
                            _this.result = response.content.Result;
                        });
                    }
                    else {
                        this.result = '';
                    }
                };
                __decorate([
                    aurelia_framework_1.bindable, 
                    __metadata('design:type', String)
                ], HelloCustomElement.prototype, "name", void 0);
                HelloCustomElement = __decorate([
                    aurelia_framework_1.autoinject(), 
                    __metadata('design:paramtypes', [aurelia_http_client_1.HttpClient])
                ], HelloCustomElement);
                return HelloCustomElement;
            }());
            exports_1("HelloCustomElement", HelloCustomElement);
        }
    }
});
//# sourceMappingURL=hello.js.map