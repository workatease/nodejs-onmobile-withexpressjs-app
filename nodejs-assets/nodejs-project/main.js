// Rename this sample file to main.js to use on your project.
// The main.js file will be overwritten in updates/reinstalls.

var rn_bridge = require('rn-bridge');

// Echo every message received from react-native.
rn_bridge.channel.on('message', (msg) => {
  rn_bridge.channel.send(msg);
});

// Inform react-native node is initialized.
rn_bridge.channel.send("Node was initialized.");
try {
  require('./server')(function () {
    rn_bridge.channel.send('Dev app listening on port 9000!');
    var fs = require('fs');
    fs.writeFile(rn_bridge.app.datadir() + '/helloworld.txt', 'Hello World!', function (err) {
      if (err) return console.log(err);
      console.log('Hello World > helloworld.txt');
    });
  }, rn_bridge.app.datadir());
} catch (error) {
  console.log(error);
}
