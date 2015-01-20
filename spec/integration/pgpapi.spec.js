/*globals describe, beforeEach, require, expect, it*/
/*jslint indent:2,node:true*/

describe('PGP api integration', function() {
  'use strict';
  var freedom;

  beforeEach(function() {
    console.log('beforeEach test');
    freedom = require('freedom-for-node').freedom;
    expect(freedom).toBeDefined();
  });

  it('encrypts, signs, decrypts, verifies', function(done) {
    freedom('../../build/demo/e2edemo.json').then(function(E2edemo) {
      console.log('start integration');
      var demo = new E2edemo();
      var msgsReceived = 0;
      var expectedMsgs = [
        'Starting test!', 'Exporting public key...', 'Encrypting/signing...',
        'Decrypted!', 'Encryption test SUCCEEDED.'];
      demo.on('print', function(msg) {
        console.log(msg);
        expect(msg).toEqual(expectedMsgs[msgsReceived]);
        msgsReceived++;
        if (msgsReceived === 5) {
          done();
        }
      });
      demo.rundemo();
    });

  });
});