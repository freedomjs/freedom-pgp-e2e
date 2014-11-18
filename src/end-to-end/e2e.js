
var E2eModule;
(function (E2eModule) {
    var pgpContext = new e2e.openpgp.ContextImpl();
    pgpContext.armorOutput = false;
    var pgpUser;

    var E2eImp = (function () {
        function E2eImp(dispatchEvent) {
            var _this = this;
            this.dispatchEvent = dispatchEvent;
            this.setup = function (passphrase, userid) {
                pgpUser = userid;
                pgpContext.setKeyRingPassphrase(passphrase);

                if (e2e.async.Result.getValue(pgpContext.searchPrivateKey(pgpUser)).length == 0) {
                    var username = pgpUser.slice(0, userid.lastIndexOf('<')).trim();
                    var email = pgpUser.slice(userid.lastIndexOf('<') + 1, -1);
                    _this.generateKey(username, email);
                }
                return Promise.resolve();
            };
            this.exportKey = function () {
                var serialized = e2e.async.Result.getValue(pgpContext.searchPublicKey(pgpUser))[0].serialized;
                return Promise.resolve(e2e.openpgp.asciiArmor.encode('PUBLIC KEY BLOCK', serialized));
            };
            this.signEncrypt = function (data, encryptKey, sign) {
                if (typeof sign === "undefined") { sign = true; }
                var result = e2e.async.Result.getValue(pgpContext.importKey(function (str, f) {
                    f('');
                }, encryptKey));
                var keys = e2e.async.Result.getValue(pgpContext.searchPublicKey(result[0]));
                var signKey;
                if (sign) {
                    signKey = e2e.async.Result.getValue(pgpContext.searchPrivateKey(pgpUser))[0];
                } else {
                    signKey = null;
                }
                return new Promise(function (F, R) {
                    pgpContext.encryptSign(buf2array(data), [], keys, [], signKey).addCallback(function (ciphertext) {
                        F(array2buf(ciphertext));
                    }).addErrback(R);
                });
            };
            this.verifyDecrypt = function (data, verifyKey) {
                if (typeof verifyKey === "undefined") { verifyKey = ''; }
                var byteView = new Uint8Array(data);
                return new Promise(function (F, R) {
                    pgpContext.verifyDecrypt(function () {
                        return '';
                    }, e2e.openpgp.asciiArmor.encode('MESSAGE', byteView)).addCallback(function (r) {
                        var signed = null;
                        if (verifyKey) {
                            signed = r.verify.success[0].uids;
                        }
                        F({
                            data: array2buf(r.decrypt.data),
                            signedBy: signed
                        });
                    }).addErrback(R);
                });
            };
            this.armor = function (data, type) {
                if (typeof type === "undefined") { type = 'MESSAGE'; }
                var byteView = new Uint8Array(data);
                return Promise.resolve(e2e.openpgp.asciiArmor.encode(type, byteView));
            };
            this.dearmor = function (data) {
                return Promise.resolve(array2buf(e2e.openpgp.asciiArmor.parse(data).data));
            };
            this.generateKey = function (name, email) {
                return new Promise(function (F, R) {
                    var expiration = Date.now() / 1000 + (3600 * 24 * 365);
                    pgpContext.generateKey('ECDSA', 256, 'ECDH', 256, name, '', email, expiration).addCallback(function (keys) {
                        if (keys.length == 2) {
                            F();
                        } else {
                            R(new Error('Failed to generate key'));
                        }
                    });
                });
            };
            this.deleteKey = function (uid) {
                pgpContext.deleteKey(uid);
                return Promise.resolve();
            };
            this.importKey = function (keyStr) {
                return new Promise(function (F, R) {
                    pgpContext.importKey(function (str, f) {
                        f('');
                    }, keyStr).addCallback(F);
                });
            };
            this.searchPrivateKey = function (uid) {
                return new Promise(function (F, R) {
                    pgpContext.searchPrivateKey(uid).addCallback(F);
                });
            };
            this.searchPublicKey = function (uid) {
                return new Promise(function (F, R) {
                    pgpContext.searchPublicKey(uid).addCallback(F);
                });
            };
        }
        return E2eImp;
    })();
    E2eModule.E2eImp = E2eImp;

    function array2str(a) {
        var str = '';
        for (var i = 0; i < a.length; i++) {
            str += String.fromCharCode(a[i]);
        }
        return str;
    }

    function str2buf(s) {
        var buffer = new ArrayBuffer(s.length * 2);
        var view = new Uint16Array(buffer);
        for (var i = 0; i < s.length; i++) {
            view[i] = s.charCodeAt(i);
        }
        return buffer;
    }

    function array2buf(a) {
        var buffer = new ArrayBuffer(a.length);
        var byteView = new Uint8Array(buffer);
        byteView.set(a);
        return buffer;
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
        freedom['crypto']().providePromises(E2eImp);
    }
})(E2eModule || (E2eModule = {}));
//# sourceMappingURL=e2e.js.map
