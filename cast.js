/**
 * Handles starting and stopping cast
 */

const exec  = require('child_process').execSync,
      spawn = require('child_process').spawn,
      path  = require('path');

const AD_CMD = path.join(__dirname, 'audiodevice');
const CC_CMD = path.join(__dirname, 'node_modules/chromecast-osx-audio/bin/chromecast.js');

let cc_process,
    original_output,
    casting = false;

/**
 * Returns a list of available streaming devices
 */
module.exports.list = () => exec(CC_CMD + ' -l').toString().trim().split('\n').slice(1);

/**
 * Begins streaming on the given device
 */
module.exports.start = (which) => {
  if (casting) return;
  casting = true;

  // Save original audio output
  original_output = exec(AD_CMD + ' output').toString();

  // Set new audio output
  exec(AD_CMD + ' output "Soundflower (2ch)"');

  // Enable chromecast streaming
  cc_process = spawn(CC_CMD + ' -d ' + which);
}

/**
 * Stops streaming
 */
module.exports.stop = () => {
  if (!casting) return;
  casting = false;

  // Reset audio output
  output = exec(AD_CMD + ' output ' + original_output).toString().trim();
  if (output === 'device not found!') {
    // Original device not available anymore, attempt to reset
    exec(AD_CMD + ' output "Internal Speakers"');
  }

  // Kill chromecast streaming process
  cc_process.kill();
}
