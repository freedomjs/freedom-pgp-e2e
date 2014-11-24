/// <reference path='../../freedom/typings/freedom.d.ts' />
/// <reference path="../../third_party/typings/es6-promise/es6-promise.d.ts" />
/// <reference path='../../freedom/coreproviders/uproxylogging.d.ts' />
/// <reference path='../../end-to-end/e2e.d.ts' />


module E2eSample {
  // TODO: grab logger from freedom.core().getLogger('name')
  // once this depends on freedom 0.6
  // (i.e. after cutting out uproxy-lib dependency)
  var log :Freedom_UproxyLogging.Log = freedom['core.log']('Diagnose');
  var logManager :Freedom_UproxyLogging.LogManager = freedom['core.logmanager']();
  var e2e :E2eProvider = freedom['e2e']();

  freedom.on('command', function(m) {
    log.debug('received command %1', [m]);
    if (m == 'pgp_test') {
      doPgpTest();
    }
  });

  freedom.on('getLogs', function() {
    logManager.getLogs()
        .then(function(strs: string[]) {
          for (var i = 0; i < strs.length; i++) {
            freedom.emit('print', strs[i]);
          }
        })
        .then(() => {
          logManager.clearLogs();
        });
  });

  function print(m: any) {
    freedom.emit('print', m);
  }

  function doPgpTest() {
    log.debug('start doPgpTest');

    var buffer :ArrayBuffer = new ArrayBuffer(12);
    var byteView :Uint8Array = new Uint8Array(buffer);
    // bytes for the string "abcd1234"
    byteView.set([49, 50, 51, 52, 49, 50, 51, 52, 49, 50, 51, 52]);

    e2e.setup('super secret passphrase', 'Joe Test <joetest@example.com>')
      .then(() => {
        log.debug('exporting public key');
        return e2e.exportKey();
      })
      .then((publicKey: string) => {
        log.debug('encrypting/signing');
        return e2e.signEncrypt(buffer, publicKey, true)
          .then((encryptedData:ArrayBuffer) => {
          return e2e.verifyDecrypt(encryptedData, publicKey)
        });
      })
      .then((result: VerifyDecryptResult) => {
        log.debug('decrypted!')
        var resultView :Uint8Array = new Uint8Array(result.data);
        if (result.signedBy[0] == 'Joe Test <joetest@example.com>' &&
            String.fromCharCode.apply(null, resultView) ==
            String.fromCharCode.apply(null, byteView)) {
          print('pgp encryption test succeeded.');
        } else {
          print('pgp encryption test failed.');
        } 
      })
      .catch((e:Error) => {
        log.error('doPgpTest encountered error %1', [e]);
      });
  }
}

