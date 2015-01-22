/*globals freedom*/
/*jslint indent:2*/

var start = function(E2edemo) {
  var demo = new E2edemo();
  demo.on('print', function(msg) {
    var lines = msg.split('\n');
    for (var i = 0; i < lines.length; i++) {
      printToPage(lines[i]);
    }
  });
  demo.rundemo();
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
