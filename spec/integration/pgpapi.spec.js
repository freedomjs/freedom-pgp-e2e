/*globals describe, beforeEach, require, expect, it */
/*jslint indent:2,white:true,sloppy:true,node:true*/

describe('PGP api integration', function() {
  "use strict";
  var freedom;

  beforeEach(function() {
    freedom = require('freedom-for-node').freedom;
    expect(freedom).toBeDefined();
  });

  it('encrypts, signs, decrypts, verifies', function(done) {
    freedom('../../build/demo/e2edemo.json').then(function(E2edemo) {
      var demo = new E2edemo();
      var msgsReceived = 0;
      demo.on('print', function(msg) {
        console.log(msg);
        console.log(++msgsReceived);
      });
      demo.rundemo();
      //done();
    });

  });
});