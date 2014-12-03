/* globals freedom */
/* jslint indent:2,white:true,sloppy:true */

var start = function(e2edemo) {
  var page = freedom();
  var button = document.getElementById('get-log-btn');

  button.onclick = function(e) {
    page.emit('getLogs');
  };

  window.setTimeout(function() {
    printToPage('============ Log encryption test with e2e ============');
    //page.emit('command', 'pgp_test');
    console.log("BAR");
    console.log(e2edemo);
    e2edemo.doPgpTest();
  }, 0);

  page.on('print', function(msg) {
    var lines = msg.split('\n');
    for (var i = 0; i < lines.length; i++) {
      printToPage(lines[i]);
    }
  });
};

window.onload = function() {
 freedom('e2edemo.json', {
    "debug": true,
    "portType": "Frame"
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