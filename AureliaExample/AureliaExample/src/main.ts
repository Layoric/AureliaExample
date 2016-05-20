/// <reference path='../typings/browser.d.ts'/>

import {Aurelia} from 'aurelia-framework';

export function configure(aurelia: Aurelia) {
    aurelia.use
        .standardConfiguration()
        .feature('src/resources')
        .developmentLogging();

    aurelia.start().then(x => x.setRoot('src/app'));
}