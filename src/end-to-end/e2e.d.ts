/// <reference path="../third_party/typings/es6-promise/es6-promise.d.ts" />

// This is the interface that a module that has logger as a dependency gets to
// use.

interface PgpKey {
  subKeys : any[];
  uids: string[];
  key: any;
  serialized: number[];
}

interface VerifyDecryptResult {
  data: string;
  signedBy: string[];
}


interface E2eProvider {
  setup() : Promise<void>;
  generateKey(name:string, email:string) : Promise<void>;
  deleteKey(uid:string) : Promise<void>;
  importKey(keyStr:string) : Promise<string[]>;
  searchPrivateKey(uid:string) : Promise<PgpKey[]>;
  searchPublicKey(uid:string) : Promise<PgpKey[]>;
  doEncryption(plaintext:string, publicKey: string) : Promise<string>;
  doDecryption(ciphertext:string) : Promise<string>;

  encryptSign(plaintext:string, encryptKey:string, signatureKey:string) : Promise<string>;

  verifyDecrypt(ciphertext:string) : Promise<VerifyDecryptResult>;

  providePromises(provider:Object) : void;
}

// TODO: add this again once https://github.com/Microsoft/TypeScript/issues/52
// is fixed.
//
// declare module freedom {
//     function e2e(): E2eProvider;
// }
