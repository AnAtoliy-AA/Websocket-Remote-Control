import { SocketMessages } from "../constants/messages";
import { SocketCommands } from "../constants/commands";
import { ICustomWebSocket } from "../types/customWebSocket";
import controlsSwitcher from "./controlsSwitcher";
import { createWebSocketStream } from 'ws';

function onConnect(wsClient: ICustomWebSocket) {
  wsClient.send(SocketMessages.CONNECTED_SUCCESSFULLY);

  wsClient.isAlive = true;

  wsClient.on(SocketCommands.PONG, () => {
    wsClient.isAlive = true
  });

  const duplex = createWebSocketStream(wsClient, {
    decodeStrings: false,
  })

  duplex.on(SocketCommands.READABLE_DUPLEX, async function () {
    let data = ''
    let chunk;

    while (null !== (chunk = duplex.read())) {
      data += chunk
    };

    try {
      controlsSwitcher(data, duplex);
    } catch (error) {
      console.log(SocketMessages.ERROR, error);
    }
  })

  wsClient.on(SocketCommands.CLOSE, async function () {
    duplex.destroy();
    
    console.log(SocketMessages.CONNECTION_INTERRUPTED);
  });
}

export default onConnect;
