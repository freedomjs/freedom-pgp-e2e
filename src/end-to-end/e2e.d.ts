/// <reference path="../third_party/typings/es6-promise/es6-promise.d.ts" />

// This is the interface that a module that has logger as a dependency gets to
// use.

interface PgpKey {
  uids :string[];
}

interface PgpUser {
  uid :string;  // format: "name <email>"
  name :string;
  email :string;
}

interface VerifyDecryptResult {
  data :ArrayBuffer;
  signedBy :string[];
}

interface E2eProvider {
  // Standard freedom crypto API
  setup(passphrase:string, userid:string) :Promise<void>;
  exportKey() :Promise<string>;
  signEncrypt(data:ArrayBuffer, encryptKey?:string,
              sign?:boolean) :Promise<ArrayBuffer>;
  verifyDecrypt(data:ArrayBuffer, verifyKey?:string,
                decrypt?:boolean) :Promise<ArrayBuffer>;
  armor(data:ArrayBuffer, header:string) :Promise<string>;
  dearmor(data:string, header:string) :Promise<ArrayBuffer>;

  // "Internal" API specific to e2e
  importKey(keyStr:string) :Promise<string[]>;
  generateKey(name:string, email:string) :Promise<void>;
  deleteKey(uid:string) :Promise<void>;
  searchPrivateKey(uid:string) :Promise<PgpKey[]>;
  searchPublicKey(uid:string) :Promise<PgpKey[]>;
  e2eencryptSign(data:ArrayBuffer, encryptKey:string,
                 signatureKey:string) :Promise<ArrayBuffer>;
  e2everifyDecrypt(data:ArrayBuffer) :Promise<VerifyDecryptResult>;
  providePromises(provider:Object) :void;
}
