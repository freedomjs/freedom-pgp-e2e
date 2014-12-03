/*globals freedom,Uint8Array,ArrayBuffer*/
/*jslint indent:2,white:true,sloppy:true*/

var e2edemo = function (dispatchEvents) {
  'use strict';
  dispatchEvents('print', 'start doPgpTest');
  var e2e = freedom.e2e();

  var buffer = new ArrayBuffer(12);
  var byteView = new Uint8Array(buffer);

  byteView.set([49, 50, 51, 52, 49, 50, 51, 52, 49, 50, 51, 52]);

  e2e.setup('super secret passphrase', 'Joe Test <joetest@example.com>').then(
    function () {
      dispatchEvents('print', 'exporting public key...');
      return e2e.exportKey();
    }).then(function (publicKey) {
    dispatchEvents('print', 'encrypting/signing...');
    return e2e.signEncrypt(buffer, publicKey, true).then(
      function (encryptedData) {
        return e2e.verifyDecrypt(encryptedData, publicKey);
      });
  }).then(function (result) {
    dispatchEvents('print', 'decrypted!');
    var resultView = new Uint8Array(result.data);
    if (result.signedBy[0] == 'Joe Test <joetest@example.com>' &&
        String.fromCharCode.apply(null, resultView) ==
        String.fromCharCode.apply(null, byteView)) {
      dispatchEvents('print', 'pgp encryption test succeeded.');
    } else {
      dispatchEvents('print', 'pgp encryption test failed.');
    }
  }).catch(function (e) {
    dispatchEvents('print', 'doPgpTest encountered error %1', [e]);
  });
};

freedom().provideSynchronous(e2edemo);
