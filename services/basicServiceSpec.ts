'use strict'

import {BasicService} from './basicService';

describe("Test BasicService", function() {

    it("Test BasicService constant", function(done) {
        let constant = BasicService.getConstant();
        expect(constant).toBe(100);
        done();
    });

});