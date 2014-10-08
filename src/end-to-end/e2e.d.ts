/// <reference path="../third_party/typings/es6-promise/es6-promise.d.ts" />

// This is the interface that a module that has logger as a dependency gets to
// use.

interface PgpKey {
  uids: string[];
  subKeys: SubKey[];
}

interface SubKey {
  fingerprintHex: string;
}

interface PgpUser {
  uid: string;  // format: "name <email>"
  name: string;
  email: string;
}

interface VerifyDecryptResult {
  data: string;
  signedBy: string[];
}


interface E2eProvider {
  // Standard freedom crypto API
  setup(passphrase:string, userid: string) : Promise<void>;
  exportKey(): Promise<string>;
  signEncrypt(plaintext:string, publicKey: string,
              sign?:boolean) : Promise<string>;
  verifyDecrypt(ciphertext:string, decrypt?:boolean) : Promise<string>;

  // "Internal" API specific to e2e
  importKey(keyStr:string) : Promise<string[]>;
  generateKey(name:string, email:string) : Promise<void>;
  deleteKey(uid:string) : Promise<void>;
  searchPrivateKey(uid:string) : Promise<PgpKey[]>;
  searchPublicKey(uid:string) : Promise<PgpKey[]>;
  e2eencryptSign(plaintext:string, encryptKey:string,
                 signatureKey:string) :Promise<string>;
  e2everifyDecrypt(ciphertext:string) : Promise<VerifyDecryptResult>;
  providePromises(provider:Object) : void;
}

// TODO: add this again once https://github.com/Microsoft/TypeScript/issues/52
// is fixed.
//
// declare module freedom {
//     function e2e(): E2eProvider;
// }
