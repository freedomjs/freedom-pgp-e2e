/// <reference path='../freedom/typings/freedom.d.ts' />
/// <reference path="../third_party/typings/es6-promise/es6-promise.d.ts" />

interface PgpKey {
  uids :string[];
}

interface PgpUser {
  uid :string;  // format: "name <email>"
  name :string;
  email :string;
}

interface PgpDecryptResult {
  decrypt : { data :number[];};
  verify  : {
    success :PgpKey[];
    failure :PgpKey[];
  }
}

interface VerifyDecryptResult {
  data :ArrayBuffer;
  signedBy :string[];
}

interface ParseResult {
  data :ArrayBuffer;
  charset :string;
}

declare module e2e.async {
  class Result<T> {
    addCallback(f:(a:T) => void) :e2e.async.Result<T>;
    addErrback(f:(e:Error) => void) :e2e.async.Result<T>;

    // TODO: how to replace any? static member can not reference 'T'.
    //static getValue(result: e2e.async.Result<T>) : T;
    static getValue(result:any) :any;
  }
}

declare module goog.storage.mechanism.HTML5LocalStorage {
  function prepareFreedom() :Promise<void>;
}

declare module e2e.openpgp.asciiArmor {
  function encode(type:string, payload:ArrayBuffer,
                  opt_headers?:any) :string;
  function parse(text:string) :ParseResult;
}

declare module e2e.openpgp {
  interface PassphraseCallbackFunc {
    (str:string, f:(passphrase:string) => void) :void;
  }

  class ContextImpl {
    setKeyRingPassphrase(passphrase:string) :void;

    importKey(passphraseCallback:PassphraseCallbackFunc,
              keyStr:string) :e2e.async.Result<string[]>;

    exportKeyring(armored:boolean) :e2e.async.Result<string>;

    // We don't need to know how key is being represented, thus use any here.
    searchPublicKey(uid:string) :e2e.async.Result<PgpKey[]>;

    searchPrivateKey(uid:string) :e2e.async.Result<PgpKey[]>;

    // NOTE - these are e2e-internal encryption functions
    // and are not directly equivalent to the freedom API
    encryptSign(data:ArrayBuffer, options:any[],
                encryptionKeys:PgpKey[], passphrases:string[],
                signatureKey?:PgpKey) :e2e.async.Result<ArrayBuffer>;

    verifyDecrypt(passphraseCallback:PassphraseCallbackFunc,
                  data:ArrayBuffer) :e2e.async.Result<PgpDecryptResult>;

    generateKey(keyAlgo:string, keyLength:number, subkeyAlgo:any,
                subkeyLength:number, name:string, comment:string,
                email:string, expiration:number) :e2e.async.Result<PgpKey[]>;

    deleteKey(uid:string) :void;
  }
}

module E2eModule {

  var pgpContext :e2e.openpgp.ContextImpl = new e2e.openpgp.ContextImpl();
  var pgpUser :string;

  export class E2eImp {

    constructor(public dispatchEvent: any) {
    }

    // Standard freedom crypto API
    public setup = (passphrase:string, userid:string) :Promise<void> => {
      // this function has the side-effect to setup the keyright storage. 
      pgpContext.setKeyRingPassphrase(passphrase);
      // e2e ContextImpl expects separate name/email so we have to split userid
      // Doing so *naively* - assuming userid is of form "name <email>"
      var username: string = userid.slice(0, userid.lastIndexOf('<')).trim();
      var email: string = userid.slice(userid.lastIndexOf('<') + 1, -1);
      this.generateKey(username, email);
      pgpUser = userid;
      return Promise.resolve<void>();
    }

    public testSetup = () :Promise<void> => {
      // this function has the side-effect to setup the keyright storage. 
      pgpContext.setKeyRingPassphrase('');
      return Promise.resolve<void>();
    }

    public exportKey = () :Promise<string> => {
      var serialized = e2e.async.Result.getValue(pgpContext.searchPublicKey(
        pgpUser))[0].serialized;
      return Promise.resolve<string>(
        e2e.openpgp.asciiArmor.encode('PUBLIC KEY BLOCK', serialized));
    }

    public signEncrypt = (data:ArrayBuffer, encryptKey:string,
                          sign:boolean = true) :Promise<ArrayBuffer> => {
      // TODO Result.getValue will be deprecated within 12 months, change
      var result :string[] = e2e.async.Result.getValue(
        pgpContext.importKey((str, f) => { f(''); }, encryptKey));
      var keys :PgpKey[] = e2e.async.Result.getValue(
        pgpContext.searchPublicKey(result[0]));
      return new Promise<ArrayBuffer>(function(F, R) {
        pgpContext.encryptSign(data, [], keys, [])
          .addCallback(F).addErrback(R);
      });
    }

    public verifyDecrypt = (data:ArrayBuffer, verifyKey:string,
                            decrypt:boolean = true) :Promise<ArrayBuffer> => {
      return new Promise(function(F, R) {
        pgpContext.verifyDecrypt(
          () => { return ''; }, // passphrase callback
          data)
          .addCallback((r:PgpDecryptResult) => {F(r.decrypt.data);})
          .addErrback(R);
      });
    }

    public armor = (data:ArrayBuffer, header:string = '') :Promise<string> => {
      return Promise.resolve<string>(
        e2e.openpgp.asciiArmor.encode(header, data));
    }

    public dearmor = (data:string, header:string = '') :Promise<ArrayBuffer> => {
      return Promise.resolve<ArrayBuffer>(
        e2e.openpgp.asciiArmor.parse(data).data);
    }

    public generateKey = (name:string, email:string) :Promise<void> => {
      return new Promise<void>((F, R) => {
        // expires after one year
        var expiration : number = Date.now() / 1000 + (3600 * 24 * 365);
        pgpContext.generateKey(
          'ECDSA', 256, 'ECDH', 256, name, '', email,
          expiration).addCallback((keys: PgpKey[]) => {
            if (keys.length == 2) {
              F();
            } else {
              R(new Error('Failed to generate key'))
            }
          });
      });
    }

    public deleteKey = (uid:string) :Promise<void> => {
      pgpContext.deleteKey(uid);
      return Promise.resolve<void>();
    }

    public importKey = (keyStr:string) :Promise<string[]> => {
      return new Promise<string[]>(function(F, R) {
        pgpContext.importKey((str, f) => { f(''); }, keyStr).addCallback(F);
      });
    }

    public searchPrivateKey = (uid:string) :Promise<PgpKey[]> => {
      return new Promise(function(F, R) {
        pgpContext.searchPrivateKey(uid).addCallback(F);
      });
    }

    public searchPublicKey = (uid:string) :Promise<PgpKey[]> => {
      return new Promise(function(F, R) {
        pgpContext.searchPublicKey(uid).addCallback(F);
      });
    }

    public e2eencryptSign = (data:ArrayBuffer, encryptKey:string,
                             signatureKey:string) :Promise<ArrayBuffer> => {
        var importResult :string[] = e2e.async.Result.getValue(
          pgpContext.importKey((str, f) => { f(''); }, encryptKey));
        var keys :PgpKey[] = e2e.async.Result.getValue(
          pgpContext.searchPublicKey(importResult[0]));
        var importResult2 :string[] = e2e.async.Result.getValue(
          pgpContext.importKey((str, f) => { f(''); }, signatureKey));
        var signKey :PgpKey = e2e.async.Result.getValue(
          pgpContext.searchPrivateKey(importResult2[0]))[0];

        return new Promise<ArrayBuffer>(function(F, R) {
          pgpContext.encryptSign(data, [], keys, [], signKey)
            .addCallback(F).addErrback(R);
        });
      }

    public e2everifyDecrypt = (
      data:ArrayBuffer) :Promise<VerifyDecryptResult> => {
      return new Promise(function(F, R) {
        pgpContext.verifyDecrypt(
          () => { return ''; }, // passphrase callback
          data)
          .addCallback((r:PgpDecryptResult) => {
            F({
              data: array2str(r.decrypt.data),
              signedBy: r.verify.success[0].uids} ); 
          })
          .addErrback(R);
      });
    }
  }

  function array2str(a:number[]) :string {
    var str = '';
    for (var i = 0; i < a.length; i++) {
      str += String.fromCharCode(a[i]);
    }
    return str;
  }

  /** REGISTER PROVIDER **/
  if (typeof freedom !== 'undefined') {
    freedom['crypto']().providePromises(E2eImp);
  }
}
