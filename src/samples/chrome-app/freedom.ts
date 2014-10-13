/// <reference path='../../freedom/typings/freedom.d.ts' />
/// <reference path="../../third_party/typings/es6-promise/es6-promise.d.ts" />
/// <reference path='../../freedom/coreproviders/uproxylogging.d.ts' />
/// <reference path='../../end-to-end/e2e.d.ts' />


module E2eSample {
  var log: Freedom_UproxyLogging.Log = freedom['core.log']('Diagnose');
  var logManager: Freedom_UproxyLogging.LogManager = freedom['core.logmanager']();
  var e2e: E2eProvider = freedom['e2e']();

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

    var testString: string = 'asdfasdf';

    e2e.setup('', 'Joe Test <joetest@example.com>')
      .then(() => {
        log.debug('exporting public key');
        return e2e.exportKey();
      })
      .then((result: string) => {
        log.debug('encrypting/signing');
        return e2e.signEncrypt(testString, result);
      })
      .then(e2e.verifyDecrypt)
      .then((result: string) => {
        log.debug('decrypted!')
        if (result == testString) {
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

