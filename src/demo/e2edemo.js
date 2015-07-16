/*globals freedom,Uint8Array,ArrayBuffer*/
/*jslint indent:2*/

var e2edemo = function (dispatchEvent) {
  'use strict';
  this.dispatch = dispatchEvent;
};

e2edemo.prototype.runCryptoDemo = function() {
  'use strict';
  var e2e = new freedom.e2e();
  var plaintext = new ArrayBuffer(12);
  var byteView = new Uint8Array(plaintext);
  // "123412341234" in ASCII
  byteView.set([49, 50, 51, 52, 49, 50, 51, 52, 49, 50, 51, 52]);

  this.dispatch('print', 'Starting encryption test! Clearing past key...');
  e2e.clear().then(function() {
    return e2e.setup('secret passphrase', 'Joe Test <joetest@example.com>');
  }).then(
    function() {
      this.dispatch('print', 'Exporting public key...');
      return e2e.exportKey();
    }.bind(this)).then(function(publicKey) {
      this.dispatch('print', 'Encrypting/signing...');
      return e2e.signEncrypt(plaintext, publicKey.key, true).then(
        function(encryptedData) {
          this.dispatch('print', 'Decrypting...');
          return e2e.verifyDecrypt(encryptedData, publicKey.key);
        }.bind(this));
    }.bind(this)).then(function(result) {
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
      function(e) {
        if (e.message) {
          e = e.message;
        }
        this.dispatch('print', 'Encryption test encountered error: ' + e);
      }.bind(this));
};

e2edemo.prototype.runImportDemo = function(publicKeyStr, privateKeyStr,
                                           keyFingerprint) {
  'use strict';
  var e2e = new freedom.e2e();
  this.dispatch('print', '');  // blank line to separate from crypto test
  this.dispatch('print', 'Starting keypair import test!');
  e2e.importKeypair('', '<quantsword@gmail.com>', privateKeyStr).then(
    function() {
      this.dispatch('print', 'Imported keypair...');
      return e2e.getFingerprint(publicKeyStr);
    }.bind(this)).then(
      function(result) {
        if (result === keyFingerprint) {
          this.dispatch('print', 'Fingerprint correct...');
        } else {
          this.dispatch('print', 'Fingerprint incorrect!');
        }
        return e2e.exportKey();
      }.bind(this)).then(
        function(result) {
          if (result.key === publicKeyStr &&
              result.fingerprint === keyFingerprint) {
            this.dispatch('print', 'Keypair import test SUCCEEDED.');
          } else {
            this.dispatch('print', 'Keypair import test FAILED.');
          }
        }.bind(this)).catch(
        function(e) {
          if (e.message) {
            e = e.message;
          }
          this.dispatch('print', 'Keypair import test encountered error ' + e);
        }.bind(this));
};

freedom().provideSynchronous(e2edemo);
