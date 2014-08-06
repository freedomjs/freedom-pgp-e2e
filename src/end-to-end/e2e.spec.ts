/// <reference path='../freedom-declarations/freedom.d.ts' />
/// <reference path="../third_party/typings/es6-promise/es6-promise.d.ts" />
/// <reference path='../third_party/typings/jasmine/jasmine.d.ts' />

describe("e2e", function() {
  var e2e = new E2eModule.E2eImp('');

  beforeEach(function() {
    e2e.setup();
  });

  /*
  it('format string', function() {
    expect(logger.format('D', 'tag', 'simple string', []))
        .toMatch(/.*\|tag\|D\|simple string/);
    expect(logger.format('I', 'test-module', 'second string', []))
        .toMatch(/.*\|test-module\|I\|second string/);

    expect(logger.format('W', 'test', '%1 pinged %2 with id=%3', [
                         'Bob', 'Alice', '123456']))
        .toMatch(/.*\|test\|W\|Bob pinged Alice with id=123456/);

  });*/

});
