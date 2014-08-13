/// <reference path='../freedom-declarations/freedom.d.ts' />
/// <reference path="../third_party/typings/es6-promise/es6-promise.d.ts" />
/// <reference path='../third_party/typings/jasmine/jasmine.d.ts' />

interface Error {
  fileName: string;
  lineNumber: number;
  stack: string;
}

describe("e2eImp", function() {
  var e2eImp = new E2eModule.E2eImp('');

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

  var publicKeyStr2 : string = 
    '-----BEGIN PGP PUBLIC KEY BLOCK-----\n' +
    'Charset: UTF-8\n' +
    '\n' +
    'xv8AAABSBFPlbJgTCCqGSM49AwEHAgMEeDKUXvoVzX/G71zTyGSRj/8wX0rwbcR4\n' +
    'CWvgWLr5tgXmtrxszUMDVkL4q3IyL+Kq2QNu24d/fanozzh5W/0+GM3/AAAAEDx0\n' +
    'ZXN0QGdtYWlsLmNvbT7C/wAAAGYEEBMIABj/AAAABYJT5WyY/wAAAAmQyvVjQH9i\n' +
    'mjMAAFj1APkBlzr8AjTS6fd0iGhQr+2EGtfileyfQx75lcQ3PTaL8wD/ac0jIEZI\n' +
    '+Kjj5mTygsVvB7f6otEY2kt5s1PZNGS6xjDO/wAAAFYEU+VsmBIIKoZIzj0DAQcC\n' +
    'AwRIo+L7MEGWPFKKwTqFXGU7tzQTCtqIKYIJdUEbC6TJnkLyE0T0QRViEioZ9hUt\n' +
    'MbjetaL8j0sIVYz8j8op8E3VAwEIB8L/AAAAZgQYEwgAGP8AAAAFglPlbJj/AAAA\n' +
    'CZDK9WNAf2KaMwAAueIBAL+wmZPkI/4AKhw48Vv3OpJVJCipns/aY4B1FSv4B6ok\n' +
    'AQDkwTOM+GBDawUO2e1ad5UBDQRY9cVQcQ6rJ9HrPHeL7g==\n' +
    '=CAr8\n' +
    '-----END PGP PUBLIC KEY BLOCK-----\n';

  var privateKeyStr2 : string =
    '-----BEGIN PGP PRIVATE KEY BLOCK-----\n' +
    'Charset: UTF-8\n' +
    'Version: End-To-End v0.3.1338\n' +
    '\n' +
    'xf8AAAB3BFPlbJgTCCqGSM49AwEHAgMEeDKUXvoVzX/G71zTyGSRj/8wX0rwbcR4\n' +
    'CWvgWLr5tgXmtrxszUMDVkL4q3IyL+Kq2QNu24d/fanozzh5W/0+GAABAL8lilDe\n' +
    'aNBrJb3rD0N9IZHRKN55Y1D6IP3qd6mDKe/TESDN/wAAABA8dGVzdEBnbWFpbC5j\n' +
    'b20+wv8AAABmBBATCAAY/wAAAAWCU+VsmP8AAAAJkMr1Y0B/YpozAABY9QD5AZc6\n' +
    '/AI00un3dIhoUK/thBrX4pXsn0Me+ZXENz02i/MA/2nNIyBGSPio4+Zk8oLFbwe3\n' +
    '+qLRGNpLebNT2TRkusYwx/8AAAB7BFPlbJgSCCqGSM49AwEHAgMESKPi+zBBljxS\n' +
    'isE6hVxlO7c0EwraiCmCCXVBGwukyZ5C8hNE9EEVYhIqGfYVLTG43rWi/I9LCFWM\n' +
    '/I/KKfBN1QMBCAcAAQDnXfHUMpj18STlok0zNqocHCiYivWPnmyDRslnGglBKQ9b\n' +
    'wv8AAABmBBgTCAAY/wAAAAWCU+VsmP8AAAAJkMr1Y0B/YpozAAC54gD+JTzt2JHA\n' +
    'tBB2Vp6wjqCkdTjQWvYLEcmGT9sPMBBEaGIBANxC4d9fbdOHV4d8etk9VVrrzu8Q\n' +
    'Yl9+3fApzDpylYplxv8AAABSBFPlbJgTCCqGSM49AwEHAgMEeDKUXvoVzX/G71zT\n' +
    'yGSRj/8wX0rwbcR4CWvgWLr5tgXmtrxszUMDVkL4q3IyL+Kq2QNu24d/fanozzh5\n' +
    'W/0+GM3/AAAAEDx0ZXN0QGdtYWlsLmNvbT7C/wAAAGYEEBMIABj/AAAABYJT5WyY\n' +
    '/wAAAAmQyvVjQH9imjMAAFj1APkBlzr8AjTS6fd0iGhQr+2EGtfileyfQx75lcQ3\n' +
    'PTaL8wD/ac0jIEZI+Kjj5mTygsVvB7f6otEY2kt5s1PZNGS6xjDO/wAAAFYEU+Vs\n' +
    'mBIIKoZIzj0DAQcCAwRIo+L7MEGWPFKKwTqFXGU7tzQTCtqIKYIJdUEbC6TJnkLy\n' +
    'E0T0QRViEioZ9hUtMbjetaL8j0sIVYz8j8op8E3VAwEIB8L/AAAAZgQYEwgAGP8A\n' +
    'AAAFglPlbJj/AAAACZDK9WNAf2KaMwAAueIBAL+wmZPkI/4AKhw48Vv3OpJVJCip\n' +
    'ns/aY4B1FSv4B6okAQDkwTOM+GBDawUO2e1ad5UBDQRY9cVQcQ6rJ9HrPHeL7g==\n' +
    '=2qgG\n' +
    '-----END PGP PRIVATE KEY BLOCK-----\n';

  beforeEach(function() {
  });

  it('test importKey with public key', (done) => {
    e2eImp.testSetup()
    .then(() => {
      return e2eImp.importKey(publicKeyStr);
    })
    .then(() => {
      return e2eImp.searchPublicKey('<quantsword@gmail.com>');
    })
    .then((keys:PgpKey[]) => {
      expect(keys.length).toEqual(1);
      expect(keys[0].uids[0]).toEqual('<quantsword@gmail.com>');
    })
    .then(() => {
      return e2eImp.deleteKey('<quantsword@gmail.com>');
    })
    .then(() => {
      return e2eImp.searchPublicKey('<quantsword@gmail.com>');
    })
    .then((keys:PgpKey[]) => {
      expect(keys.length).toEqual(0);
    })
    .catch((e:Error) => {
      console.log('test throw error' + e);
      expect(false).toBeTruthy();}) 
    .then(done);
  });

  it('test importKey with private key', function(done) {
    e2eImp.testSetup()
    .then(() => {
      return e2eImp.importKey(privateKeyStr)
    })
    .then(() => {
      return e2eImp.searchPrivateKey('<quantsword@gmail.com>');
    })
    .then((keys:PgpKey[]) => {
      expect(keys.length).toEqual(1);
      expect(keys[0].uids[0]).toEqual('<quantsword@gmail.com>');
    })
    .catch((e:Error) => {
      console.log('test throw error' + e);
      expect(false).toBeTruthy();}) 
    .then(done);
  });
  
  it('encrypt and decrypt', (done) => {
    e2eImp.testSetup()
    .then(() => {
      return e2eImp.doEncryption('123412341234', publicKeyStr);
    })
    .then((cipherText:string) => {
      return e2eImp.importKey(privateKeyStr).then(() => {
        return e2eImp.doDecryption(cipherText);
      });
    })
    .then((newText:string) => {
      expect(newText).toEqual('123412341234');
    })
    .catch((e:Error) => {
      console.log('test throw error' + e);
      expect(false).toBeTruthy();}) 
    .then(done);
  });


  it('encryptSign and verifyDecrypt', (done) => {
    e2eImp.testSetup()
    .then(() => {
      return e2eImp.encryptSign('123412341234', publicKeyStr, privateKeyStr2);
    })
    .then((cipherText:string) => {
      return e2eImp.importKey(privateKeyStr).then(() => {
        return e2eImp.importKey(publicKeyStr2).then(() => {
          return e2eImp.verifyDecrypt(cipherText);
        });
      });
    })
    .then((result:VerifyDecryptResult) => {
      expect(result.data).toEqual('123412341234');
      expect(result.signedBy.length).toEqual(1);
      expect(result.signedBy[0]).toEqual('<test@gmail.com>');
    })
    .catch((e:Error) => {
      console.log('test throw error' + e);
      expect(false).toBeTruthy();}) 
    .then(done);
  });

  it('generate keys', (done) => {
    e2eImp.testSetup()
    .then(() => {
      return e2eImp.generateKey('tester', 'test@gmail.com');
    })
    .then(() => {
      expect(true).toBeTruthy();
      return e2eImp.searchPrivateKey('tester <test@gmail.com>');
    })
    .then((keys:PgpKey[]) => {
      expect(keys.length).toEqual(1);
      expect(keys[0].uids[0]).toEqual('tester <test@gmail.com>');
    })
    .catch((e:Error) => {
      console.log(e.fileName + ':' + e.lineNumber + '\t' + e.message + '\n' + e.stack);
      expect(false).toBeTruthy();}) 
    .then(done);
  });

});
