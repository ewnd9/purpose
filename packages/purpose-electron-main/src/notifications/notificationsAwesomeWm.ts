import { exec } from 'child_process';

// https://awesomewm.org/doc/api/libraries/naughty.html
export function showNotification({ text, duration }) {
  text = text.replace(/\n/g, '\\\n');

  return runScript(`
    local naughty = require("naughty")
    my_notification = naughty.notify({ text = "${text}", timeout = ${duration * 60 | 0 /* in s */}, run = function ()
      naughty.destroy(x)
      -- naughty.notify({ text = "hi" })
    end })
  `);
}

export function hideNotification() {
  return runScript(`
    local naughty = require("naughty")
    naughty.destroy(my_notification)
  `);
}

function runScript(lua) {
  return exec(`echo '${lua}' | awesome-client`, (error, stdout, stderr) => {
    console.log(`stdout: ${stdout}`);
    console.log(`stderr: ${stderr}`);

    if (error !== null) {
      console.log(`exec error: ${error}`);
    }
  });
}
