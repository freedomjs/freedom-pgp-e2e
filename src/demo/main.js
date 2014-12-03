/* globals freedom */
/* jslint indent:2,white:true,sloppy:true */

var start = function(e2edemo) {
  var demo = new e2edemo();
  demo.on('print', function(msg) {
    var lines = msg.split('\n');
    for (var i = 0; i < lines.length; i++) {
      printToPage(lines[i]);
    }
  });
  demo.rundemo();
};

window.onload = function() {
  freedom("e2edemo.json", {
    "debug": "log"
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
