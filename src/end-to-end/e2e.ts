/// <reference path='../freedom-declarations/freedom.d.ts' />
/// <reference path="../third_party/typings/es6-promise/es6-promise.d.ts" />

interface PgpKey {
  subKeys : any[];
  uids: string[];
  key: any;
  serialized: number[];
}

interface PgpDecryptResult {
  decrypt : { data: number[];};
  verify  : {
    success : PgpKey[];
    failure : PgpKey[];
  }
}

interface VerifyDecryptResult {
  data: string;
  signedBy: string[];
}

declare module e2e.async {
  class Result<T> {
    addCallback(f: (a: T) => void) : e2e.async.Result<T>;
    addErrback(f: (e: Error) => void) : e2e.async.Result<T>;

    // TODO: how to replace any? static member can not reference 'T'.
    //static getValue(result: e2e.async.Result<T>) : T;
    static getValue(result: any) : any;
  }
}

declare module goog.storage.mechanism.HTML5LocalStorage {
  function prepareFreedom() : Promise<void>;
}

declare module e2e.openpgp {
  interface PassphraseCallbackFunc {
    (str: string, f: (passphrase: string) => void) : void;
  }

  class ContextImpl {
    setKeyRingPassphrase(passphrase: string) : void;

    importKey(passphraseCallback: PassphraseCallbackFunc,
              keyStr: string) : e2e.async.Result<string[]>;

    // We don't need to know how key is being represented, thus use any here.
    searchPublicKey(uid: string) : e2e.async.Result<any[]>;

    searchPrivateKey(uid: string) : e2e.async.Result<any[]>;

    encryptSign(plaintext: string, 
                options: any [], 
                encryptionKeys: PgpKey [], 
                passphrases: string[],
                signatureKey?: PgpKey) : e2e.async.Result<string>;

    verifyDecrypt(passphraseCallback: any,
                  encryptedMessage: string) : e2e.async.Result<PgpDecryptResult>;
  }
}

module E2eModule {

  var pgpContext: e2e.openpgp.ContextImpl = new e2e.openpgp.ContextImpl();

  export class E2eImp {
    constructor(public dispatchEvent: any) {
    }

    public setup = () : Promise<void> => {
      // this function has the side-effect to setup the keyright storage. 
      pgpContext.setKeyRingPassphrase('');
      return Promise.resolve<void>();

      return goog.storage.mechanism.HTML5LocalStorage.prepareFreedom()
          .then(() => {
            // this function has the side-effect to setup the keyright storage. 
            pgpContext.setKeyRingPassphrase('');
          });
    }

    public testSetup = () : Promise<void> => {
      // this function has the side-effect to setup the keyright storage. 
      pgpContext.setKeyRingPassphrase('');
      return Promise.resolve<void>();
    }

    public importKey = (keyStr: string) : Promise<string[]> => {
      return new Promise<string[]>(function(F, R) {
        pgpContext.importKey((str, f) => { f(''); }, keyStr).addCallback(F);
      });
    }

    public searchPrivateKey = (uid: string) : Promise<any[]> => {
      return new Promise(function(F, R) {
        pgpContext.searchPrivateKey(uid).addCallback(F);
      });
    }

    public searchPublicKey = (uid: string) : Promise<any[]> => {
      return new Promise(function(F, R) {
        pgpContext.searchPublicKey(uid).addCallback(F);
      });
    }

    public doEncryption = (plaintext: string,
                           publicKey: string) : Promise<string> => {
      var result: string[] = e2e.async.Result.getValue(
          pgpContext.importKey((str, f) => { f(''); }, publicKey));
      var keys: PgpKey[] = e2e.async.Result.getValue(
        pgpContext.searchPublicKey(result[0]));
      return new Promise<string>(function(F, R) {
          pgpContext.encryptSign(plaintext, [], keys, [])
              .addCallback(F).addErrback(R);
        });
    }

    public encryptSign = (plaintext: string, 
                          encryptKey: string,
                          signatureKey: string) : Promise<string> => {
      var importResult: string[] = e2e.async.Result.getValue(
          pgpContext.importKey((str, f) => { f(''); }, encryptKey));
      var keys: PgpKey[] = e2e.async.Result.getValue(
          pgpContext.searchPublicKey(importResult[0]));
      var importResult2: string[] = e2e.async.Result.getValue(
          pgpContext.importKey((str, f) => { f(''); }, signatureKey));
      var signKey: PgpKey = e2e.async.Result.getValue(
          pgpContext.searchPrivateKey(importResult2[0]))[0];
      
      return new Promise<string>(function(F, R) {
          pgpContext.encryptSign(plaintext, [], keys, [], signKey)
              .addCallback(F).addErrback(R);
        });
    }

    public doDecryption = (ciphertext: string) : Promise<string> => {
      return new Promise(function(F, R) {
          pgpContext.verifyDecrypt(
              () => { return ''; }, // passphrase callback
              ciphertext)
          .addCallback((r: PgpDecryptResult) => {F(array2str(r.decrypt.data));})
          .addErrback(R);
        });
    }

    public verifyDecrypt = (ciphertext: string) 
        : Promise<VerifyDecryptResult> => {
      return new Promise(function(F, R) {
          pgpContext.verifyDecrypt(
              () => { return ''; }, // passphrase callback
              ciphertext)
          .addCallback((r: PgpDecryptResult) => {
            F({
              data: array2str(r.decrypt.data),
              signedBy: r.verify.success[0].uids} ); 
          })
          .addErrback(R);
        });
    }
  }


  function str2array(str: string) : number[] {
    var a : number[] = [];
    for (var i = 0; i < str.length; i++) {
      a.push(str.charCodeAt(i));
    }
    return a;
  }

  function array2str(a: number[]) : string {
    var str = '';
    for (var i = 0; i < a.length; i++) {
      str += String.fromCharCode(a[i]);
    }
    return str;
  }

  /** REGISTER PROVIDER **/
  if (typeof freedom !== 'undefined') {
    freedom['e2e']().providePromises(E2eImp);
  }
}



