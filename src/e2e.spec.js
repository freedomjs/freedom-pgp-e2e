// Unit tests for e2e directly
// Tests both freedom API calls and internal methods

describe("e2eImp", function () {
  var publicKeyStr =
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

  var privateKeyStr =
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

  var e2eImp = new mye2e();
  var buffer = new ArrayBuffer(12);
  var byteView = new Uint8Array(buffer);
  // bytes for the string "abcd1234"
  byteView.set([49, 50, 51, 52, 49, 50, 51, 52, 49, 50, 51, 52]);

  beforeEach(function () {
  });

  it('reject invalid userid', function(done) {
    e2eImp.setup('test passphrase', 'bad user@id').then(
      function() {
        console.log(e2eImp);  // shouldn't see this, should go to error case
        expect(false).toBeTruthy();
      }).catch(function(e) {
        expect(e).toEqual(Error('Invalid userid, expected: "name <email>"'));
    }).then(done);
  });

  it('test importKey with public key', function (done) {
    e2eImp.setup('test passphrase', 'test user <testuser@gmail.com>').then(
      function () {
        return e2eImp.importKey(publicKeyStr);
      }).then(function () {
      return e2eImp.searchPublicKey('<quantsword@gmail.com>');
    }).then(function (keys) {
      expect(keys.length).toEqual(1);
      expect(keys[0].uids[0]).toEqual('<quantsword@gmail.com>');
    }).then(function () {
      return e2eImp.deleteKey('<quantsword@gmail.com>');
    }).then(function () {
      return e2eImp.searchPublicKey('<quantsword@gmail.com>');
    }).then(function (keys) {
      expect(keys.length).toEqual(0);
    }).catch(function (e) {
               console.log(e.toString());
               expect(false).toBeTruthy();
             }).then(done);
  });

  it('test importKey with private key', function (done) {
    e2eImp.setup('test passphrase', 'test user <testuser@gmail.com>').then(
      function () {
        return e2eImp.importKey(privateKeyStr);
      }).then(function () {
      return e2eImp.searchPrivateKey('<quantsword@gmail.com>');
    }).then(function (keys) {
      expect(keys.length).toEqual(1);
      expect(keys[0].uids[0]).toEqual('<quantsword@gmail.com>');
    }).catch(function (e) {
               console.log(e.toString());
               expect(false).toBeTruthy();
             }).then(done);
  });

  it('encrypt and decrypt', function (done) {
    e2eImp.setup('test passphrase', 'test user <testuser@gmail.com>').then(
      function () {
        return e2eImp.exportKey();
      }).then(function (publicKey) {
      return e2eImp.signEncrypt(buffer, publicKey, false);
    }).then(function (encryptedData) {
      return e2eImp.verifyDecrypt(encryptedData);
    }).then(function (result) {
      expect(result.data).toEqual(buffer);
    }).catch(function (e) {
               console.log(e.toString());
               expect(false).toBeTruthy();
             }).then(done);
  });

  it('encryptSign and verifyDecrypt', function (done) {
    e2eImp.setup('test passphrase', 'test user <testuser@gmail.com>').then(
      function () {
        return e2eImp.exportKey();
      }).then(function (publicKey) {
      return e2eImp.signEncrypt(buffer, publicKey, true).then(
        function (encryptedData) {
          return e2eImp.verifyDecrypt(encryptedData, publicKey);
        });
    }).then(function (result) {
      expect(result.data).toEqual(buffer);
      expect(result.signedBy.length).toEqual(1);
      expect(result.signedBy[0]).toEqual('test user <testuser@gmail.com>');
    }).catch(function (e) {
               console.log(e.toString());
               expect(false).toBeTruthy();
             }).then(done);
  });

  it('generate keys', function (done) {
    e2eImp.setup('test passphrase', 'test user <testuser@gmail.com>').then(
      function () {
        expect(true).toBeTruthy();
        return e2eImp.searchPrivateKey('test user <testuser@gmail.com>');
      }).then(function (keys) {
      expect(keys.length).toEqual(1);
      expect(keys[0].uids[0]).toEqual('test user <testuser@gmail.com>');
    }).catch(function (e) {
               console.log(e.toString());
               expect(false).toBeTruthy();
             }).then(done);
  });

  it('export public key', function (done) {
    e2eImp.setup('test passphrase', 'test user <testuser@gmail.com>').then(
      function () {
        expect(true).toBeTruthy();
        return e2eImp.exportKey();
      }).then(function (publicKeyStr) {
      expect(publicKeyStr.length > 36);
      expect(publicKeyStr.substring(0, 36)).toEqual(
        '-----BEGIN PGP PUBLIC KEY BLOCK-----');
    }).catch(function (e) {
               console.log(e.toString());
               expect(false).toBeTruthy();
             }).then(done);
  });

  it('armor and dearmor', function (done) {
    e2eImp.setup('test passphrase', 'test user <testuser@gmail.com>').then(
      function () {
        return e2eImp.armor(buffer);
      }).then(function (armored) {
      return e2eImp.dearmor(armored);
    }).then(function (dearmored) {
      expect(dearmored).toEqual(buffer);
    }).catch(function (e) {
               console.log(e.toString());
               expect(false).toBeTruthy();
             }).then(done);
  });
});
