window.onload = function() {
  var button = document.getElementById('get-log-btn');

  button.onclick = function(e) {
    window.freedom.emit('getLogs');
  };

  window.setTimeout(function() {
    printToPage('============ Log encryption test with e2e ============')
    freedom.emit('command', 'pgp_test');
  }, 0);
}

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
