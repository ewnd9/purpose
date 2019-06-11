import fs from 'fs';
import net from 'net';
import nanobus from 'nanobus';

// @ts-ignore
export const bus = nanobus();
const SOCKET_PATH = '/tmp/purpose-app.sock';

fs.stat(SOCKET_PATH, err => {
  if (!err) {
    fs.unlinkSync(SOCKET_PATH);
  }

  const unixServer = net.createServer(connection => {
    connection.on('data', data => {
      try {
        bus.emit('socket', JSON.parse(data.toString()));
      } catch (e) {
        console.log(e);
      }
    });
  });

  unixServer.listen(SOCKET_PATH);
});
