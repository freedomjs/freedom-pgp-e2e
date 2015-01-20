/*globals freedom,Uint8Array,ArrayBuffer*/
/*jslint indent:2*/

var e2edemo = function (dispatchEvent) {
  'use strict';
  this.dispatch = dispatchEvent;
  this.e2e = freedom.e2e();
};

e2edemo.prototype.rundemo = function() {
  'use strict';
  var buffer = new ArrayBuffer(12);
  var byteView = new Uint8Array(buffer);
  byteView.set([49, 50, 51, 52, 49, 50, 51, 52, 49, 50, 51, 52]);

  this.dispatch('print', 'Starting test!');
  this.e2e.setup('secret passphrase', 'Joe Test <joetest@example.com>').then(
    function () {
      this.dispatch('print', 'Exporting public key...');
      return this.e2e.exportKey();
    }.bind(this)).then(function (publicKey) {
    this.dispatch('print', 'Encrypting/signing...');
    return this.e2e.signEncrypt(buffer, publicKey, true).then(
      function (encryptedData) {
        return this.e2e.verifyDecrypt(encryptedData, publicKey);
      }.bind(this));
    }.bind(this)).then(function (result) {
    this.dispatch('print', 'Decrypted!');
    var resultView = new Uint8Array(result.data);
    if (result.signedBy[0] === 'Joe Test <joetest@example.com>' &&
        String.fromCharCode.apply(null, resultView) ===
        String.fromCharCode.apply(null, byteView)) {
      this.dispatch('print', 'Encryption test SUCCEEDED.');
    } else {
      this.dispatch('print', 'Encryption test FAILED.');
    }
  }.bind(this)).catch(
    function (e) {
      this.dispatch('print', 'Encryption test encountered error %1', [e]);
  }.bind(this));
};

freedom().provideSynchronous(e2edemo);
