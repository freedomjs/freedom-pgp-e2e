/*globals freedom*/
/*jslint indent:2*/

var start = function(E2edemo) {
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

  var demo = new E2edemo();
  demo.on('print', function(msg) {
    var lines = msg.split('\n');
    for (var i = 0; i < lines.length; i++) {
      printToPage(lines[i]);
    }
    if (lines[0] === 'Encryption test SUCCEEDED.') {
      printToPage('\n\n');
      demo.runImportDemo(publicKeyStr, privateKeyStr, keyFingerprint, keyWords);
    }
  });
  demo.runCryptoDemo();
};

window.onload = function() {
  freedom('e2edemo.json', {
    'debug': 'log'
  }).then(start);
};

function printToPage(msg) {
  var logDiv = document.getElementById('log');
  if (typeof msg == 'object') {
    logDiv.innerHTML += JSON.stringify(msg) + '<br />';
  } else {
    logDiv.innerHTML += msg + '<br />';
  }
}
