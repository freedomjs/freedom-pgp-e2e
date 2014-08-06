/// <reference path="../third_party/typings/es6-promise/es6-promise.d.ts" />

// This is the interface that a module that has logger as a dependency gets to
// use.
interface E2eProvider {
  setup() : Promise<void>;
  importKey(keyStr: string) : Promise<string[]>;
  searchPrivateKey(uid: string) : Promise<string[]>;
  searchPublicKey(uid: string) : Promise<string[]>;
  doEncryption(plaintext: string, publicKey: string) : Promise<string>;
  doDecryption(ciphertext: string) : Promise<string>;

  providePromises(provider: Object) : void;
}

// TODO: add this again once https://github.com/Microsoft/TypeScript/issues/52
// is fixed.
//
// declare module freedom {
//     function e2e(): E2eProvider;
// }
