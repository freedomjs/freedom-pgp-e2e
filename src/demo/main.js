/* globals freedom:true, console, require, global */
/* jslint indent:2,white:true,sloppy:true */

var start = function() {
  var button = document.getElementById('get-log-btn');

  button.onclick = function(e) {
    freedom.emit('getLogs');
  };

  window.setTimeout(function() {
    printToPage('============ Log encryption test with e2e ============');
    freedom.emit('command', 'pgp_test');
  }, 0);
};

window.onload = function() {
  freedom('e2edemo.json', {
//      "portType": "Frame",
      "debug": true
//      "strongIsolation": true
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

window.freedom.on('print', function(msg) {
  var lines = msg.split('\n');
  for (var i = 0; i < lines.length; i++) {
    printToPage(lines[i]);
  }
});
