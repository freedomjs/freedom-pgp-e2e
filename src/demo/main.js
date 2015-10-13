/*globals freedom*/
/*jslint indent:2*/

var start = function(E2edemo) {
  var keyFingerprint = 'B734 A06E 3413 DD98 6774  3FB3 E9B8 201F 5B87 6D89';
  var keyWordlist = ["seabird", "confidence", "ragtime", "headwaters",
                     "choking", "barbecue", "swelter", "narrative", "freedom",
                     "hydraulic", "cowbell", "pocketful", "treadmill",
                     "provincial", "bison", "businessman", "erase", "liberty",
                     "goggles", "matchmaker"];

  var demo = new E2edemo();
  demo.on('print', function(msg) {
    var lines = msg.split('\n');
    for (var i = 0; i < lines.length; i++) {
      printToPage(lines[i]);
    }
    if (lines[0] === 'Encryption test SUCCEEDED.') {
      printToPage('\n\n');
      demo.runImportDemo(keyFingerprint, keyWordlist);
    }
  });
  demo.runCryptoDemo();
};

window.onload = function() {
  freedom('e2edemo.json', {
    'debug': 'log'
  }).then(start);
};

function printToPage(msg) {
  var logDiv = document.getElementById('log');
  if (typeof msg == 'object') {
    logDiv.innerHTML += JSON.stringify(msg) + '<br />';
  } else {
    logDiv.innerHTML += msg + '<br />';
  }
}
