import fs from 'fs';
import makeDir from 'make-dir';

const configDir = `${process.env.HOME}/.config/purpose`; // only Linux for now
const configPath = `${configDir}/db.json`;

if (!fs.existsSync(configDir)) {
  // @ts-ignore
  makeDir.sync(configDir);
}

if (!fs.existsSync(configPath)) {
  fs.writeFileSync(configPath, '{}');
}
