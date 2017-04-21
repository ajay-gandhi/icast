/**
 * Handles starting and stopping cast
 */

const exec  = require('child_process').execSync,
      spawn = require('child_process').spawn,
      path  = require('path');

const AD_CMD = path.join(__dirname, 'audiodevice');
const CC_PATH = path.join(__dirname, 'node_modules/chromecast-osx-audio/bin/chromecast.js');

let cc_process,
    original_output,
    original_input,
    original_volume,
    casting = false;

/**
 * Returns a list of available streaming devices
 */
module.exports.list = () =>
  exec('/usr/local/bin/node ' + CC_PATH + ' -l').toString().trim().split('\n').slice(1);

/**
 * Begins streaming on the given device
 */
module.exports.start = (which) => {
  if (casting) return;
  casting = true;

  // Save originals
  original_output = exec(AD_CMD + ' output').toString().trim();
  original_input  = exec(AD_CMD + ' input').toString().trim();
  original_volume = exec('osascript -e "output volume of (get volume settings)"').toString().trim();

  // Set new properties
  exec(AD_CMD + ' output "Soundflower (2ch)"');
  exec(AD_CMD + ' input "Soundflower (2ch)"');
  exec('osascript -e "set volume output volume 100 --100%"');

  // Enable chromecast streaming
  cc_process = spawn('/usr/local/bin/node', [CC_PATH, '-d', which]);
}

/**
 * Stops streaming
 */
module.exports.stop = () => {
  if (!casting) return;
  casting = false;

  // Reset audio properties
  let result = exec(AD_CMD + ' output "' + original_output + '"').toString().trim();
  if (result === 'device not found!') {
    // Original device not available anymore, attempt to reset
    exec(AD_CMD + ' output "Internal Speakers"');
  }
  result = exec(AD_CMD + ' input "' + original_input + '"').toString().trim();
  if (result === 'device not found!') {
    // Original device not available anymore, attempt to reset
    exec(AD_CMD + ' input "Internal Speakers"');
  }
  exec('osascript -e "set volume output volume ' + original_volume + ' --100%"');

  // Kill chromecast streaming process
  cc_process.kill();
}
