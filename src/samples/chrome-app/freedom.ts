/// <reference path='../../freedom-declarations/freedom.d.ts' />
/// <reference path="../../third_party/typings/es6-promise/es6-promise.d.ts" />
/// <reference path='../../logger/logger.d.ts' />
/// <reference path='../../end-to-end/e2e.d.ts' />


module E2eSample {
  var logger = freedom['Logger']();
  var e2e: E2eProvider = freedom['e2e']();
  var tag = 'Sample';

  var publicKeyStr : string = 
    '-----BEGIN PGP PUBLIC KEY BLOCK-----\n' +
    'Charset: UTF-8\n' +
    '\n' +
    'xv8AAABSBFPIW9ETCCqGSM49AwEHAgMEh9yJj8tEYplKXKKiTWphXYkJEQSbm0GH\n' +
    'hy6dQOefg7/uuDMOdI2YF0NLbK+m0sL41Ewfgk/3TqVWCNdRpwgcKs3/AAAAFjxx\n' +
    'dWFudHN3b3JkQGdtYWlsLmNvbT7C/wAAAGYEEBMIABj/AAAABYJTyFvR/wAAAAmQ\n' +
    '6bggH1uHbYkAAPefAQDgx/omfDRc7hB4DT1Eong2ytygVXMIuQJmRjnKxqM61AEA\n' +
    'g5D6nKw1Woicmg7x2qfj7wU+eLlZ5UXTNqjpe8xQ4+3O/wAAAFYEU8hb0RIIKoZI\n' +
    'zj0DAQcCAwS10YFtrIWwvvLE8r32gCEtDD7Cnefkem6Tz4fDFlrdrAUNXADxGLaq\n' +
    'AQsgmceluPWjIBY7GtMvd6z/biN8YOANAwEIB8L/AAAAZgQYEwgAGP8AAAAFglPI\n' +
    'W9H/AAAACZDpuCAfW4dtiQAAegAA/RYXPbjEOHc7iy3xFxWKWPvpnPc5LwX/6DDt\n' +
    'woPMCTLeAQCpjnRiMaIK7tjslDfXd4BtaY6K90JHuRPCQUJ7Uw+fRA==\n' +
    '=3Iv4\n' +
    '-----END PGP PUBLIC KEY BLOCK-----';

  var privateKeyStr : string = 
    '-----BEGIN PGP PRIVATE KEY BLOCK-----\n' +
    'Charset: UTF-8\n' +
    'Version: End-To-End v0.3.1338\n' +
    '\n' +
    'xf8AAAB3BFPIW9ETCCqGSM49AwEHAgMEh9yJj8tEYplKXKKiTWphXYkJEQSbm0GH\n' +
    'hy6dQOefg7/uuDMOdI2YF0NLbK+m0sL41Ewfgk/3TqVWCNdRpwgcKgABAIaxz+cn\n' +
    'aR1CNIhNGoo7m0T8RycWCslolvmV6JnSFzhYDn3N/wAAABY8cXVhbnRzd29yZEBn\n' +
    'bWFpbC5jb20+wv8AAABmBBATCAAY/wAAAAWCU8hb0f8AAAAJkOm4IB9bh22JAAD3\n' +
    'nwEA4Mf6Jnw0XO4QeA09RKJ4NsrcoFVzCLkCZkY5ysajOtQBAIOQ+pysNVqInJoO\n' +
    '8dqn4+8FPni5WeVF0zao6XvMUOPtx/8AAAB7BFPIW9ESCCqGSM49AwEHAgMEtdGB\n' +
    'bayFsL7yxPK99oAhLQw+wp3n5Hpuk8+HwxZa3awFDVwA8Ri2qgELIJnHpbj1oyAW\n' +
    'OxrTL3es/24jfGDgDQMBCAcAAP40eoOaXxwE/EIXZOddFf+423N12TuuQfqPREhx\n' +
    'KOMOAg94wv8AAABmBBgTCAAY/wAAAAWCU8hb0f8AAAAJkOm4IB9bh22JAAB6AAD/\n' +
    'R8thL3J2WQsIviAWAZFaip8WCzom60sXCfb3eVC3Eg4BAMR+IehbobVWr3AEdNIj\n' +
    'MjSM+cgdhFBqQqQyxFOaX3kRxv8AAABSBFPIW9ETCCqGSM49AwEHAgMEh9yJj8tE\n' +
    'YplKXKKiTWphXYkJEQSbm0GHhy6dQOefg7/uuDMOdI2YF0NLbK+m0sL41Ewfgk/3\n' +
    'TqVWCNdRpwgcKs3/AAAAFjxxdWFudHN3b3JkQGdtYWlsLmNvbT7C/wAAAGYEEBMI\n' +
    'ABj/AAAABYJTyFvR/wAAAAmQ6bggH1uHbYkAAPefAQDgx/omfDRc7hB4DT1Eong2\n' +
    'ytygVXMIuQJmRjnKxqM61AEAg5D6nKw1Woicmg7x2qfj7wU+eLlZ5UXTNqjpe8xQ\n' +
    '4+3O/wAAAFYEU8hb0RIIKoZIzj0DAQcCAwS10YFtrIWwvvLE8r32gCEtDD7Cnefk\n' +
    'em6Tz4fDFlrdrAUNXADxGLaqAQsgmceluPWjIBY7GtMvd6z/biN8YOANAwEIB8L/\n' +
    'AAAAZgQYEwgAGP8AAAAFglPIW9H/AAAACZDpuCAfW4dtiQAAegAA/RYXPbjEOHc7\n' +
    'iy3xFxWKWPvpnPc5LwX/6DDtwoPMCTLeAQCpjnRiMaIK7tjslDfXd4BtaY6K90JH\n' +
    'uRPCQUJ7Uw+fRA==\n' +
    '=H/6h\n' +
    '-----END PGP PRIVATE KEY BLOCK-----';


  freedom.on('command', function(m) {
    logger.debug(tag, 'received command ' + m);
    if (m == 'pgp_test') {
      doPgpTest();
    }
  });

  freedom.on('getLogs', function() {
    logger.getLogs()
        .then(function(str: string) {
          freedom.emit('print', str);
        })
        .then(() => {
          logger.reset();
        });
  });

  function print(m: any) {
    freedom.emit('print', m);
  }

  function doPgpTest() {
    logger.debug(tag, 'start doPgpTest');

    var testString: string = 'asdfasdf';

    e2e.setup()
    .then(() => {
      return e2e.doEncryption(testString, publicKeyStr); })
    .then((result: string) => {
        return e2e.importKey(privateKeyStr).then((keys: string[]) => {
          return Promise.resolve(result);
        }); })
    .then(e2e.doDecryption)
    .then((result: string) => {
      if (result == testString) {
        print('pgp encryption test succeeded.');
      } else {
        print('pgp encryption test failed.');
      } 
    })
    .catch((e: Error) => {
      logger.error('doPgpTest encountered error %1', e);
    });

  }
}

