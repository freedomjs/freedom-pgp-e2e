/*globals freedom, console, e2e, exports, ArrayBuffer, Uint8Array, Uint16Array, DataView*/
/*jslint indent:2*/

if (typeof Promise === 'undefined' && typeof ES6Promise !== 'undefined') {
  // Polyfill for karma unit tests
  Promise = ES6Promise.Promise;
}

// getRandomValue polyfill, currently needed for Firefox webworkers
var refreshBuffer = function (size) { return Promise.resolve(); };  // null-op
if (typeof crypto === 'undefined') {
  var rand = freedom['core.crypto'](),
      buf,
      offset = 0;
  refreshBuffer = function (size) {
    return rand.getRandomBytes(size).then(function (bytes) {
      buf = new Uint8Array(bytes);
      offset = 0;
    }, function (err) {
      console.log(err);
    });
  }.bind(this);

  crypto = {};
  crypto.getRandomValues = function (buffer) {
    if (buffer.buffer) {
      buffer = buffer.buffer;
    }
    var size = buffer.byteLength,
        view = new Uint8Array(buffer),
        i;
    if (offset + size > buf.length) {
      throw new Error("Insufficient Randomness Allocated.");
    }
    for (i = 0; i < size; i += 1) {
      view[i] = buf[offset + i];
    }
    offset += size;
  };
}

/**
 * Implementation of a crypto-pgp provider for freedom.js
 * using cryptographic code from Google's end-to-end.
 **/

var mye2e = function(dispatchEvents) {
  this.pgpContext = new e2e.openpgp.ContextImpl();
  this.pgpContext.armorOutput = false;
  this.pgpUser = null;
};


// These methods implement the actual freedom crypto API
mye2e.prototype.setup = function(passphrase, userid) {
  // userid needs to be in format "name <email>"
  if (!userid.match(/^[^<]*\s?<[^>]*>$/)) {
    return Promise.reject(Error('Invalid userid, expected: "name <email>"'));
  }
  this.pgpUser = userid;
  var scope = this;  // jasmine tests fail w/bind approach
  return refreshBuffer(5000).then(store.prepareFreedom).then(function() {
    scope.pgpContext.setKeyRingPassphrase(passphrase);
    if (e2e.async.Result.getValue(
      scope.pgpContext.searchPrivateKey(scope.pgpUser)).length === 0) {
      var username = scope.pgpUser.slice(0, userid.lastIndexOf('<')).trim();
      var email = scope.pgpUser.slice(userid.lastIndexOf('<') + 1, -1);
      scope.generateKey(username, email);
    }
  });//.bind(this));  // TODO: switch back to using this once jasmine works
};

mye2e.prototype.clear = function() {
  // e2e can only store one private key in LocalStorage
  // Attempting to set another will result in an HMAC error
  // So, make sure to clear before doing so
  // See googstorage.js for details on how storage works
  return store.prepareFreedom().then(function() {
    var storage = new store();
    storage.remove('UserKeyRing');
  });
};

mye2e.prototype.importKeypair = function(passphrase, userid, privateKey) {
  var scope = this;  // jasmine tests fail w/bind approach
  return this.clear().then(function() {
    scope.pgpContext.setKeyRingPassphrase(passphrase);
    return scope.importKey(privateKey, passphrase);
  }).then(function() {
    if (e2e.async.Result.getValue(
      scope.pgpContext.searchPrivateKey(userid)).length === 0 ||
        e2e.async.Result.getValue(
          scope.pgpContext.searchPublicKey(userid)).length === 0) {
      return Promise.reject(Error('Keypair does not match provided userid'));
    } else if (!userid.match(/^[^<]*\s?<[^>]*>$/)) {
      return Promise.reject(Error('Invalid userid, expected: "name <email>"'));
    } else {
      scope.pgpUser = userid;
      return Promise.resolve();
    }
  });
};

mye2e.prototype.exportKey = function() {
  var keyResult = e2e.async.Result.getValue(
    this.pgpContext.searchPublicKey(this.pgpUser));
  var serialized = keyResult[0].serialized;

  return Promise.resolve({
    'key': e2e.openpgp.asciiArmor.encode('PUBLIC KEY BLOCK', serialized),
    'fingerprint': keyResult[0].key.fingerprintHex,
    'words': hex2words(keyResult[0].key.fingerprintHex)
  });
};

mye2e.prototype.getFingerprint = function(publicKey) {
  // Returns v4 fingerprint per RFC 4880 Section 12.2
  // http://tools.ietf.org/html/rfc4880#section-12.2
  var importResult = e2e.async.Result.getValue(
    this.pgpContext.importKey(function(str, f) {
      f('');
    }, publicKey));
  var keyResult = e2e.async.Result.getValue(
    this.pgpContext.searchPublicKey(importResult[0]));
  return Promise.resolve({
    'fingerprint': keyResult[0].key.fingerprintHex,
    'words': hex2words(keyResult[0].key.fingerprintHex)
  });
};

mye2e.prototype.signEncrypt = function(data, encryptKey, sign) {
  var pgp = this.pgpContext;
  var user = this.pgpUser;
  return refreshBuffer(5000).then(function () {
    if (typeof sign === 'undefined') {
      sign = true;
    }
    var importResult = e2e.async.Result.getValue(
      pgp.importKey(function(str, f) {
        f('');
      }, encryptKey));
    var keys = e2e.async.Result.getValue(
      pgp.searchPublicKey(importResult[0]));
    var signKey;
    if (sign) {
      signKey = e2e.async.Result.getValue(
        pgp.searchPrivateKey(user))[0];
    } else {
      signKey = null;
    }
    return new Promise(
      function(resolve, reject) {
        pgp.encryptSign(buf2array(data), [], keys, [], signKey).addCallback(
          function (ciphertext) {
            resolve(array2buf(ciphertext));
          }).addErrback(reject);
      });
  });
};

mye2e.prototype.verifyDecrypt = function(data, verifyKey) {
  if (typeof verifyKey === 'undefined') {
    verifyKey = '';
  } else {
    this.importKey(verifyKey);
  }
  var byteView = new Uint8Array(data);
  var pgp = this.pgpContext;
  return new Promise(
    function(resolve, reject) {
      pgp.verifyDecrypt(function () {
        return '';
      }, e2e.openpgp.asciiArmor.encode('MESSAGE', byteView)).addCallback(
        function (result) {
          var signed = null;
          if (verifyKey) {
            signed = result.verify.success[0].uids;
          }
          resolve({
            data: array2buf(result.decrypt.data),
            signedBy: signed
          });
        }).addErrback(reject);
    });
};

mye2e.prototype.armor = function(data, type) {
  if (typeof type === 'undefined') {
    type = 'MESSAGE';
  }
  var byteView = new Uint8Array(data);
  return Promise.resolve(e2e.openpgp.asciiArmor.encode(type, byteView));
};

mye2e.prototype.dearmor = function(data) {
  return Promise.resolve(array2buf(e2e.openpgp.asciiArmor.parse(data).data));
};

// Basic EC Diffie-Hellman shared secret calculation.
//
// 'curveName' is a simple string identifying the ECC curve.  "P_256" is
//    a lovely value.
// 'peerPubKey' is expected to be an armored key like "-----BEGIN PGP
//    PUBLIC KEY BLOCK...".
mye2e.prototype.ecdhBob = function(curveName, peerPubKey) {
  if (!(curveName in e2e.ecc.PrimeCurve)) {
    return Promise.reject(new Error('Invalid Prime Curve'));
  }
  try {
    // Base call in this c'tor throws.
    var ecdh = new e2e.ecc.Ecdh(curveName);
    var parsedPubkey = e2e.openpgp.block.factory.parseByteArrayTransferableKey(
        e2e.openpgp.asciiArmor.parse(peerPubKey).data);
    var pubkey = parsedPubkey.keyPacket.cipher.ecdsa_.getPublicKey();

    console.log("Running ecdh.bob with");

    var keyRing = this.pgpContext.keyRing_;
    // returns {?Array.<!e2e.openpgp.block.TransferableKey>}, but
    // doesn't seem to have the guts we want?
    var privKey = keyRing.searchKey(this.pgpUser, e2e.openpgp.KeyRing.Type.PRIVATE);
    var privkeyKey = privKey[0].toKeyObject();
    var localPrivKey = keyRing.getKeyBlock(privkeyKey);

    console.log("> this.pgpUser:" + this.pgpUser);
    console.log("> localPrivKey.keyPacket.cipher.cipher_.ecdsa_.params: " +
        localPrivKey.keyPacket.cipher.cipher_.ecdsa_.params.toString());
    console.log("> localPrivKey.keyPacket.cipher.algorithm: " +
        localPrivKey.keyPacket.cipher.algorithm);
    console.log("> localPrivKey.keyPacket.cipher.encryptedKeyData:" +
        localPrivKey.keyPacket.cipher.encryptedKeyData.toString());
    console.log("> localPrivKey.keyPacket.cipher.cipher_.key.curve: " +
        localPrivKey.keyPacket.cipher.cipher_.key.curve.toString());
    console.log("> localPrivKey.keyPacket.cipher.cipher_.key.privKey: " +
        localPrivKey.keyPacket.cipher.cipher_.key.privKey.toString());
    console.log("> localPrivKey.keyPacket.cipher.cipher_.key.pubKey: " +
        localPrivKey.keyPacket.cipher.cipher_.key.pubKey.toString());

    console.log("> localPrivKey.keyPacket.fingerprint: " +
        localPrivKey.keyPacket.fingerprint.toString());
    console.log("> localPrivKey.keyPacket.keyId: " +
        localPrivKey.keyPacket.keyId.toString());
    console.log("> localPrivKey.keyPacket.cipher:" + localPrivKey.keyPacket.cipher.toString());
    var cipher = localPrivKey.keyPacket.cipher;

    // The curve data in both cases are simple arrays of numbers, to
    // this works pretty well.
    if (cipher.cipher_.key.curve.toString() !=
        parsedPubkey.keyPacket.cipher.key.curve.toString()) {
      return Promise.reject(new Error('Keys have different curves.'));
    }


    var wrap = cipher.getWrappedCipher();
    console.log("> pubkey:" + pubkey.toString());
    console.log("> privKey:" + wrap.key.privKey.toString());
    var bobResult = ecdh.bob(pubkey, wrap.key.privKey);
    console.log("Returning bobResult.secret: " + bobResult.secret.toString());
    return Promise.resolve(array2buf(bobResult.secret));
  } catch (e) {
    console.log("ERROR: " + JSON.stringify(e));
    console.log(e);
    console.log(e.stack);
    return Promise.reject(e);
  }
};

// The following methods are part of the prototype to be able to access state
// but are not part of the API and should not be exposed to the client
mye2e.prototype.generateKey = function(name, email) {
  var pgp = this.pgpContext;
  return new Promise(
    function(resolve, reject) {
      var expiration = Date.now() / 1000 + (3600 * 24 * 365);
      pgp.generateKey('ECDSA', 256, 'ECDH', 256, name, '', email, expiration).
        addCallback(function (keys) {
          if (keys.length == 2) {
            resolve();
          } else {
            reject(new Error('Failed to generate key'));
          }
        });
    });
};

mye2e.prototype.deleteKey = function(uid) {
  this.pgpContext.deleteKey(uid);
  return Promise.resolve();
};

mye2e.prototype.importKey = function(keyStr, passphrase) {
  if (typeof passphrase === 'undefined') {
    passphrase = '';
  }
  var pgp = this.pgpContext;
  return new Promise(
    function(resolve, reject) {
      pgp.importKey(
        function(str, continuation) {
          continuation(passphrase);
        }, keyStr).addCallback(resolve).addErrback(reject);
    });
};

mye2e.prototype.searchPrivateKey = function(uid) {
  var pgp = this.pgpContext;
  return new Promise(
    function(resolve, reject) {
      pgp.searchPrivateKey(uid).addCallback(resolve).addErrback(reject);
    });
};

mye2e.prototype.searchPublicKey = function(uid) {
  var pgp = this.pgpContext;
  return new Promise(
    function(resolve, reject) {
      pgp.searchPublicKey(uid).addCallback(resolve).addErrback(reject);
    });
};



// Helper methods (that don't need state and could be moved elsewhere)
function array2str(a) {
  var str = '';
  for (var i = 0; i < a.length; i++) {
    str += String.fromCharCode(a[i]);
  }
  return str;
}

function str2buf(s) {
  var buf = new ArrayBuffer(s.length * 2);
  var view = new Uint16Array(buf);
  for (var i = 0; i < s.length; i++) {
    view[i] = s.charCodeAt(i);
  }
  return buf;
}

function array2buf(a) {
  var buf = new ArrayBuffer(a.length);
  var byteView = new Uint8Array(buf);
  byteView.set(a);
  return buf;
}

function buf2array(b) {
  var dataView = new DataView(b);
  var result = [];
  for (var i = 0; i < dataView.byteLength; i++) {
    result.push(dataView.getUint8(i));
  }
  return result;
}

if (typeof freedom !== 'undefined') {
  freedom().providePromises(mye2e);
}
if (typeof exports !== 'undefined') {
  exports.mye2e = mye2e;
}
