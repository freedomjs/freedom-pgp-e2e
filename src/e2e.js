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
  this.pgpContext = null;
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
    if (!scope.pgpContext) {
      scope.pgpContext = new e2e.openpgp.ContextImpl();
      scope.pgpContext.armorOutput = false;
    }
    return scope.pgpContext.initializeKeyRing(passphrase);
  }).then(function() {
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
    if (!scope.pgpContext) {
      scope.pgpContext = new e2e.openpgp.ContextImpl();
      scope.pgpContext.armorOutput = false;
    }
    scope.pgpContext.setKeyRingPassphrase(passphrase);
    return scope.importPrivKey(privateKey, passphrase);
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
  return this.pgpContext.getKeyDescription(publicKey).then(
      function(keyDescriptions) {
    var fingerprint = keyDescriptions[0].key.fingerprintHex;
    return {
      'fingerprint': fingerprint,
      'words': hex2words(fingerprint)
    };
  });
};

mye2e.prototype.signEncrypt = function(data, encryptKey, sign) {
  var scope = this;
  var pgp = this.pgpContext;
  var user = this.pgpUser;
  return refreshBuffer(5000).then(function () {
    if (typeof sign === 'undefined') {
      sign = true;
    }
    var keys = Promise.resolve([]);
    if (encryptKey) {
      keys = scope.importPubKey(encryptKey).then(function(key) {
        return [key];
      });
    }
    return keys;
  }).then(function(keys) {
    var signKey;
    if (sign) {
      signKey = e2e.async.Result.getValue(
        pgp.searchPrivateKey(user))[0];
    } else {
      signKey = null;
    }
    return pgp.encryptSign(buf2array(data), [], keys, [], signKey);
  }).then(array2buf);
};

mye2e.prototype.verifyDecrypt = function(data, verifyKey) {
  var importedKey;
  if (typeof verifyKey === 'undefined') {
    verifyKey = '';
    importedKey = Promise.resolve();
  } else {
    importedKey = this.importPubKey(verifyKey);
  }
  var byteView = new Uint8Array(data);
  var pgp = this.pgpContext;
  return importedKey.then(function() {
    return pgp.verifyDecrypt(function () {
        throw new Error('Passphrase decryption is not supported');
    }, buf2array(data));
  }).then(function (result) {
    var signed = null;
    if (verifyKey) {
      signed = result.verify.success[0].uids;
    }
    return {
      data: array2buf(result.decrypt.data),
      signedBy: signed
    };
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


// The following methods are part of the prototype to be able to access state
// but are not part of the API and should not be exposed to the client
mye2e.prototype.generateKey = function(name, email) {
  var pgp = this.pgpContext;
  var expiration = Date.now() / 1000 + (3600 * 24 * 365);
  return pgp.generateKey('ECDSA', 256, 'ECDH', 256, name, '', email, expiration)
      .then(function (keys) {
    if (keys.length !== 2) {
      throw new Error('Failed to generate key');
    }
  });
};

mye2e.prototype.deleteKey = function(uid) {
  this.pgpContext.deleteKey(uid);
  return Promise.resolve();
};

mye2e.prototype.importPrivKey = function(keyStr, passphrase) {
  if (typeof passphrase === 'undefined') {
    passphrase = '';
  }
  var pgp = this.pgpContext;
  return pgp.importKey(
      function(str) {
        return e2e.async.Result.toResult(passphrase);
      }, keyStr);
};

mye2e.prototype.importPubKey = function(keyStr) {
  // Algorithm:
  // 1. Compute the key description, which includes the fingerprint.
  //    This action has no side effects (does not import the key).
  // 2. Import the key.  This returns the "uid", i.e. e-mail address.
  // 3. Search for all known public keys with this uid.
  // 4. Find the key whose fingerprint matches the input.  Return this one.
  var pgp = this.pgpContext;
  return pgp.getKeyDescription(keyStr).then(function(keyDescriptions) {
    var keyDescription = keyDescriptions[0];
    return pgp.importKey(function(str) {
        throw new Error('No passphrase needed for a public key');
      }, keyStr).then(function(uids) {
      if (uids.length !== 1) throw new Error('too many uids');
      return pgp.searchPublicKey(uids[0]);
    }).then(function(candidateKeydescriptions) {
      var rightKey = null;
      candidateKeydescriptions.forEach(function(candidateKeyDescription) {
        if (candidateKeyDescription.key.fingerprintHex ===
            keyDescription.key.fingerprintHex) {
          rightKey = candidateKeyDescription;
        }
      });
      if (!rightKey) throw new Error('could not import key');
      return rightKey;
    });
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
