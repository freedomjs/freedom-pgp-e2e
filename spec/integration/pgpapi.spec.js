/*globals describe, beforeEach, require, expect, it*/
/*jslint indent:2,node:true*/

describe('PGP api integration', function() {
  'use strict';
  console.log('start!');
  if (typeof require !== 'undefined') {
    var freedom = require('freedom-for-node').freedom;
  }

  beforeEach(function() {
    console.log('beforeeach');
    console.log(freedom);
    expect(freedom).toBeDefined();
  });

  it('encrypts, signs, decrypts, verifies', function(done) {
    console.log('it');
    console.log(freedom);
    freedom('../../build/demo/e2edemo.json').then(function(E2edemo) {
      console.log('e2efreedom');
      var demo = new E2edemo();
      var msgsReceived = 0;
      var expectedMsgs = [
        'Starting test!', 'Exporting public key...', 'Encrypting/signing...',
        'Decrypting...', 'Decrypted!', 'Encryption test SUCCEEDED.'];
      demo.on('print', function(msg) {
        console.log(msg);
        expect(msg).toEqual(expectedMsgs[msgsReceived]);
        msgsReceived++;
        if (msgsReceived === 6) {
          done();
        }
      });
      demo.rundemo();
    });

  });
});