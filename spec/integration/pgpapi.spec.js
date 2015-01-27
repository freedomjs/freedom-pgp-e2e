/*globals describe, beforeEach, require, expect, it*/
/*jslint indent:2,node:true*/

describe('PGP api integration', function() {
  'use strict';
  var fdom, path;  // hack to avoid masking freedom when already defined
  if (typeof freedom === 'undefined') {
    fdom = require('freedom-for-node').freedom;
    path = '../../build/demo/e2edemo.json';
  } else {
    fdom = freedom;
    path = 'scripts/build/demo/e2edemo.json';
  }

  beforeEach(function() {
    expect(fdom).toBeDefined();
  });

  it('encrypts, signs, decrypts, verifies', function(done) {
    fdom(path).then(function(E2edemo) {
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