// Rename this sample file to main.js to use on your project.
// The main.js file will be overwritten in updates/reinstalls.

var rn_bridge = require('rn-bridge');
let datadir = rn_bridge.app.datadir();

// Echo every message received from react-native.
rn_bridge.channel.on('message', (msg) => {
  if ('string' === typeof msg) {
    if (msg === 'Start') {
      require('./server')(function () {
        rn_bridge.channel.send("Server Started");

      }, datadir);
    }
  } else if ('object' === typeof msg) {
    if (msg.path) {
      console.log(msg.path);
      datadir = msg.path;
    }
  }
  console.log(msg)
  //rn_bridge.channel.send(msg);
});

// Inform react-native node is initialized.
rn_bridge.channel.send("Node was initialized.");
//rn_bridge.channel.send(process.env);


