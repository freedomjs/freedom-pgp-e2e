/// <reference path='../freedom-declarations/freedom.d.ts' />
/// <reference path="../third_party/typings/es6-promise/es6-promise.d.ts" />

interface DecryptResult {
  decrypt : { data: number[];} ;
}

declare module e2e.async {
  class Result<T> {
    addCallback(f: (T: any) => void) : e2e.async.Result<T>;
    addErrback(f: (e: Error) => void) : e2e.async.Result<T>;

    // TODO: how to replace any? static member can not reference 'T'.
    //static getValue(result: Result<T>) : T;
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

    encryptSign(plaintext: string, options: any [], keys: any [], 
                passphrase: string) : e2e.async.Result<string>;

    verifyDecrypt(passphraseCallback: any, encryptedMessage: string) :
        e2e.async.Result<DecryptResult>;
  }
}

module E2eModule {

  var pgpContext: e2e.openpgp.ContextImpl = new e2e.openpgp.ContextImpl();

  export class E2eImp {
    constructor(public dispatchEvent: any) {
    }

    public setup = () : Promise<void> => {
      return goog.storage.mechanism.HTML5LocalStorage.prepareFreedom()
          .then(() => {
            // this function has the side-effect to setup the keyright storage. 
            pgpContext.setKeyRingPassphrase('');
          });
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
        pgpContext.searchPrivateKey(uid).addCallback(F);
      });
    }

    public doEncryption = (plaintext: string, publicKey: string) : Promise<string> => {
      var result: any = e2e.async.Result.getValue(
          pgpContext.importKey((str, f) => { f(''); }, publicKey));
      var keys = e2e.async.Result.getValue(
        pgpContext.searchPublicKey(result[0]));
      return new Promise<string>(function(F, R) {
          pgpContext.encryptSign(plaintext, [], keys, '')
              .addCallback(F)
              .addErrback((e: Error) => {
                console.log('!!! encrypion error: ' + e);
                R;
              });
        });
    }

    public doDecryption = (ciphertext: string) : Promise<string> => {
      return new Promise(function(F, R) {
          pgpContext.verifyDecrypt(
              () => { return ''; }, // passphrase callback
              ciphertext)
          .addCallback((r: DecryptResult) => {
            F(array2str(r.decrypt.data)); })
          .addErrback((e: Error) => {
                console.log('!!! encrypion error: ' + e);
                R;
              });
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



