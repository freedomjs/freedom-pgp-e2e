/*globals describe, beforeEach, require, expect, it*/
/*jslint indent:2*/

// Unit tests for e2e directly
// Tests both freedom API calls and internal methods
jasmine.DEFAULT_TIMEOUT_INTERVAL = 30000;
describe('e2eImp', function () {
  var publicKeyStr =
        '-----BEGIN PGP PUBLIC KEY BLOCK-----\r\n' +
        'Charset: UTF-8\r\n' +
        '\r\n' +
        'xv8AAABSBFPIW9ETCCqGSM49AwEHAgMEh9yJj8tEYplKXKKiTWphXYkJEQSbm0GH\r\n' +
        'hy6dQOefg7/uuDMOdI2YF0NLbK+m0sL41Ewfgk/3TqVWCNdRpwgcKs3/AAAAFjxx\r\n' +
        'dWFudHN3b3JkQGdtYWlsLmNvbT7C/wAAAGYEEBMIABj/AAAABYJTyFvR/wAAAAmQ\r\n' +
        '6bggH1uHbYkAAPefAQDgx/omfDRc7hB4DT1Eong2ytygVXMIuQJmRjnKxqM61AEA\r\n' +
        'g5D6nKw1Woicmg7x2qfj7wU+eLlZ5UXTNqjpe8xQ4+3O/wAAAFYEU8hb0RIIKoZI\r\n' +
        'zj0DAQcCAwS10YFtrIWwvvLE8r32gCEtDD7Cnefkem6Tz4fDFlrdrAUNXADxGLaq\r\n' +
        'AQsgmceluPWjIBY7GtMvd6z/biN8YOANAwEIB8L/AAAAZgQYEwgAGP8AAAAFglPI\r\n' +
        'W9H/AAAACZDpuCAfW4dtiQAAegAA/RYXPbjEOHc7iy3xFxWKWPvpnPc5LwX/6DDt\r\n' +
        'woPMCTLeAQCpjnRiMaIK7tjslDfXd4BtaY6K90JHuRPCQUJ7Uw+fRA==\r\n' +
        '=3Iv4\r\n' +
        '-----END PGP PUBLIC KEY BLOCK-----\r\n';

  var keyFingerprint = 'B734 A06E 3413 DD98 6774  3FB3 E9B8 201F 5B87 6D89';
  var keyWords = ["seabird", "confidence", "ragtime", "headwaters",
                  "choking", "barbecue", "swelter", "narrative",
                  "freedom", "hydraulic", "cowbell", "pocketful",
                  "treadmill", "provincial", "bison", "businessman",
                  "erase", "liberty", "goggles", "matchmaker"];

  var privateKeyStr =
        '-----BEGIN PGP PRIVATE KEY BLOCK-----\r\n' +
        'Charset: UTF-8\r\n' +
        'Version: End-To-End v0.3.1338\r\n' +
        '\r\n' +
        'xf8AAAB3BFPIW9ETCCqGSM49AwEHAgMEh9yJj8tEYplKXKKiTWphXYkJEQSbm0GH\r\n' +
        'hy6dQOefg7/uuDMOdI2YF0NLbK+m0sL41Ewfgk/3TqVWCNdRpwgcKgABAIaxz+cn\r\n' +
        'aR1CNIhNGoo7m0T8RycWCslolvmV6JnSFzhYDn3N/wAAABY8cXVhbnRzd29yZEBn\r\n' +
        'bWFpbC5jb20+wv8AAABmBBATCAAY/wAAAAWCU8hb0f8AAAAJkOm4IB9bh22JAAD3\r\n' +
        'nwEA4Mf6Jnw0XO4QeA09RKJ4NsrcoFVzCLkCZkY5ysajOtQBAIOQ+pysNVqInJoO\r\n' +
        '8dqn4+8FPni5WeVF0zao6XvMUOPtx/8AAAB7BFPIW9ESCCqGSM49AwEHAgMEtdGB\r\n' +
        'bayFsL7yxPK99oAhLQw+wp3n5Hpuk8+HwxZa3awFDVwA8Ri2qgELIJnHpbj1oyAW\r\n' +
        'OxrTL3es/24jfGDgDQMBCAcAAP40eoOaXxwE/EIXZOddFf+423N12TuuQfqPREhx\r\n' +
        'KOMOAg94wv8AAABmBBgTCAAY/wAAAAWCU8hb0f8AAAAJkOm4IB9bh22JAAB6AAD/\r\n' +
        'R8thL3J2WQsIviAWAZFaip8WCzom60sXCfb3eVC3Eg4BAMR+IehbobVWr3AEdNIj\r\n' +
        'MjSM+cgdhFBqQqQyxFOaX3kRxv8AAABSBFPIW9ETCCqGSM49AwEHAgMEh9yJj8tE\r\n' +
        'YplKXKKiTWphXYkJEQSbm0GHhy6dQOefg7/uuDMOdI2YF0NLbK+m0sL41Ewfgk/3\r\n' +
        'TqVWCNdRpwgcKs3/AAAAFjxxdWFudHN3b3JkQGdtYWlsLmNvbT7C/wAAAGYEEBMI\r\n' +
        'ABj/AAAABYJTyFvR/wAAAAmQ6bggH1uHbYkAAPefAQDgx/omfDRc7hB4DT1Eong2\r\n' +
        'ytygVXMIuQJmRjnKxqM61AEAg5D6nKw1Woicmg7x2qfj7wU+eLlZ5UXTNqjpe8xQ\r\n' +
        '4+3O/wAAAFYEU8hb0RIIKoZIzj0DAQcCAwS10YFtrIWwvvLE8r32gCEtDD7Cnefk\r\n' +
        'em6Tz4fDFlrdrAUNXADxGLaqAQsgmceluPWjIBY7GtMvd6z/biN8YOANAwEIB8L/\r\n' +
        'AAAAZgQYEwgAGP8AAAAFglPIW9H/AAAACZDpuCAfW4dtiQAAegAA/RYXPbjEOHc7\r\n' +
        'iy3xFxWKWPvpnPc5LwX/6DDtwoPMCTLeAQCpjnRiMaIK7tjslDfXd4BtaY6K90JH\r\n' +
        'uRPCQUJ7Uw+fRA==\r\n' +
        '=H/6h\r\n' +
        '-----END PGP PRIVATE KEY BLOCK-----\r\n';

  var e2eImp;
  var buffer = new ArrayBuffer(12);
  var byteView = new Uint8Array(buffer);
  // bytes for the string "abcd1234"
  byteView.set([49, 50, 51, 52, 49, 50, 51, 52, 49, 50, 51, 52]);

  beforeEach(function () {
    e2eImp = new mye2e();
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

  it('test importKey and deleteKey with public key', function(done) {
    e2eImp.setup('test passphrase', 'Test User <test@example.com>').then(
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

  it('test getFingerprint with public key', function(done) {
    e2eImp.setup('test passphrase', 'Test User <test@example.com>').then(
      function () {
        return e2eImp.getFingerprint(publicKeyStr);
      }).then(function (result) {
        expect(result.fingerprint).toEqual(keyFingerprint);
        expect(result.words).toEqual(keyWords);
      }).catch(function (e) {
        console.log(e.toString());
        expect(false).toBeTruthy();
      }).then(done);
  });

  it('test importKey and deleteKey with private key', function(done) {
    e2eImp.setup('test passphrase', 'Test User <testuser@gmail.com>').then(
      function () {
        return e2eImp.importKey(privateKeyStr);
      }).then(function () {
        return e2eImp.searchPrivateKey('<quantsword@gmail.com>');
      }).then(function (keys) {
        expect(keys.length).toEqual(1);
        expect(keys[0].uids[0]).toEqual('<quantsword@gmail.com>');
      }).then(function () {
        return e2eImp.deleteKey('<quantsword@gmail.com>');
      }).then(function () {
        return e2eImp.searchPrivateKey('<quantsword@gmail.com>');
      }).then(function (keys) {
        expect(keys.length).toEqual(0);
      }).catch(function (e) {
        console.log(e.toString());
        expect(false).toBeTruthy();
      }).then(done);
  });

  it('test importKeypair', function(done) {
    e2eImp.importKeypair('', '<quantsword@gmail.com>', privateKeyStr)
      .then(function () {
        expect(e2eImp.pgpUser).toEqual('<quantsword@gmail.com>');
        return e2eImp.exportKey();
      }).then(function (publicKey) {
        expect(publicKey.key).toEqual(publicKeyStr);
        expect(publicKey.fingerprint).toEqual(keyFingerprint);
        expect(publicKey.words).toEqual(keyWords);
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

  it('encrypt and decrypt', function(done) {
    e2eImp.setup('test passphrase', 'Test User <test@example.com>').then(
      function () {
        return e2eImp.exportKey();
      }).then(function (publicKey) {
        return e2eImp.signEncrypt(buffer, publicKey.key, false);
      }).then(function (encryptedData) {
        return e2eImp.verifyDecrypt(encryptedData);
      }).then(function (result) {
        expect(result.data).toEqual(buffer);
      }).catch(function (e) {
        console.log(e.toString());
        expect(false).toBeTruthy();
      }).then(done);
  });

  it('sign and verify', function(done) {
    e2eImp.setup('test passphrase', 'Test User <test@example.com>').then(
      function () {
        return Promise.all([e2eImp.exportKey(), e2eImp.signEncrypt(buffer)]);
      }).then(function (array) {
        var key = array[0].key;
        var signedData = array[1];
        return e2eImp.verifyDecrypt(signedData, key);
      }).then(function (result) {
        expect(result.data).toEqual(buffer);
      }).catch(function (e) {
        console.log(e.toString());
        expect(false).toBeTruthy();
      }).then(done);
  });

  it('encryptSign and verifyDecrypt', function(done) {
    e2eImp.setup('test passphrase', 'Test User <test@example.com>').then(
      function () {
        return e2eImp.exportKey();
      }).then(function (publicKey) {
        return e2eImp.signEncrypt(buffer, publicKey.key, true).then(
          function (encryptedData) {
            return e2eImp.verifyDecrypt(encryptedData, publicKey.key);
          });
      }).then(function (result) {
        expect(result.data).toEqual(buffer);
        expect(result.signedBy.length).toEqual(1);
        expect(result.signedBy[0]).toEqual('Test User <test@example.com>');
      }).catch(function (e) {
        console.log(e.toString());
        expect(false).toBeTruthy();
      }).then(done);
  });

  it('generate keys', function(done) {
    e2eImp.setup('test passphrase', 'Test User <test@example.com>').then(
      function () {
        expect(true).toBeTruthy();
        return e2eImp.searchPrivateKey('Test User <test@example.com>');
      }).then(function (keys) {
        expect(keys.length).toEqual(1);
        expect(keys[0].uids[0]).toEqual('Test User <test@example.com>');
      }).catch(function (e) {
        console.log(e.toString());
        expect(false).toBeTruthy();
      }).then(done);
  });

  it('export public key', function(done) {
    e2eImp.setup('test passphrase', 'Test User <test@example.com>').then(
      function () {
        expect(true).toBeTruthy();
        return e2eImp.exportKey();
      }).then(function (publicKey) {
        expect(publicKey.key.length > 36);
        expect(publicKey.key.substring(0, 36)).toEqual(
          '-----BEGIN PGP PUBLIC KEY BLOCK-----');
      }).catch(function (e) {
        console.log(e.toString());
        expect(false).toBeTruthy();
      }).then(done);
  });

  it('armor and dearmor', function(done) {
    e2eImp.setup('test passphrase', 'Test User <test@example.com>').then(
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

  it('sign and verify between two users', function(done) {
    e2eImp.setup('test passphrase', 'Test User <test@example.com>').then(function() {
      var otherUser = new mye2e();
      return otherUser.setup('other user passphrase',
          'Other User <other@example.com>').then(function() {
        return otherUser;
      });
    }).then(
      function (otherUser) {
        return Promise.all([otherUser.exportKey(),
            otherUser.signEncrypt(buffer)]);
      }).then(function (array) {
        var key = array[0].key;
        var signedData = array[1];
        return e2eImp.verifyDecrypt(signedData, key);
      }).then(function (result) {
        expect(result.data).toEqual(buffer);
      }).catch(function (e) {
        console.log(e.toString());
        expect(false).toBeTruthy();
      }).then(done);
  });
});
