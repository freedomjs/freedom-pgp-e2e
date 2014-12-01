/* globals freedom:true, console, require, global */
/* jslint indent:2,white:true,sloppy:true */

var logger = freedom.core().getLogger('e2edemo');
//var log = freedom['core.log']('Diagnose');
//var logManager = freedom['core.logmanager']();
var e2e = freedom.e2e();

freedom.on('command', function (m) {
  log.debug('received command %1', [m]);
  if (m == 'pgp_test') {
    doPgpTest();
  }
});

freedom.on('getLogs', function () {
  logManager.getLogs().then(function (strs) {
    for (var i = 0; i < strs.length; i++) {
      freedom.emit('print', strs[i]);
    }
  }).then(function () {
    logManager.clearLogs();
  });
});

function print(m) {
  freedom.emit('print', m);
}

function doPgpTest() {
  log.debug('start doPgpTest');

  var buffer = new ArrayBuffer(12);
  var byteView = new Uint8Array(buffer);

  byteView.set([49, 50, 51, 52, 49, 50, 51, 52, 49, 50, 51, 52]);

  e2e.setup('super secret passphrase', 'Joe Test <joetest@example.com>').then(
    function () {
      log.debug('exporting public key');
      return e2e.exportKey();
    }).then(function (publicKey) {
    log.debug('encrypting/signing');
    return e2e.signEncrypt(buffer, publicKey, true).then(
      function (encryptedData) {
        return e2e.verifyDecrypt(encryptedData, publicKey);
      });
  }).then(function (result) {
    log.debug('decrypted!');
    var resultView = new Uint8Array(result.data);
    if (result.signedBy[0] == 'Joe Test <joetest@example.com>' &&
        String.fromCharCode.apply(null, resultView) ==
        String.fromCharCode.apply(null, byteView)) {
      print('pgp encryption test succeeded.');
    } else {
      print('pgp encryption test failed.');
    }
  }).catch(function (e) {
    log.error('doPgpTest encountered error %1', [e]);
  });
}
