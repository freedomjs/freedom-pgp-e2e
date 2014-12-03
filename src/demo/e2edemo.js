/*globals freedom,Uint8Array,ArrayBuffer*/
/*jslint indent:2,white:true,sloppy:true*/

var e2edemo = function (dispatchEvents) {
  'use strict';
  this.dispatch = dispatchEvents;
  this.e2e = freedom.crypto();
};

e2edemo.prototype.rundemo = function() {
  'use strict';
  this.dispatch('print', 'Starting test!');

  var buffer = new ArrayBuffer(12);
  var byteView = new Uint8Array(buffer);

  byteView.set([49, 50, 51, 52, 49, 50, 51, 52, 49, 50, 51, 52]);

  this.e2e.setup('the best passphrase', 'Joe Test <joetest@example.com>').then(
    function () {
      this.dispatch('print', 'Exporting public key...');
      return this.e2e.exportKey();
    }).then(function (publicKey) {
    this.dispatch('print', 'Encrypting/signing...');
    return this.e2e.signEncrypt(buffer, publicKey, true).then(
      function (encryptedData) {
        return this.e2e.verifyDecrypt(encryptedData, publicKey);
      });
  }).then(function (result) {
    this.dispatch('print', 'Decrypted!');
    var resultView = new Uint8Array(result.data);
    if (result.signedBy[0] == 'Joe Test <joetest@example.com>' &&
        String.fromCharCode.apply(null, resultView) ==
        String.fromCharCode.apply(null, byteView)) {
      this.dispatch('print', 'Encryption test SUCCEEDED.');
    } else {
      this.dispatch('print', 'Encryption test FAILED.');
    }
  }).catch(
    function (e) {
      this.dispatch('print', 'Encryption test encountered error %1', [e]);
  });
};

freedom().provideSynchronous(e2edemo);
