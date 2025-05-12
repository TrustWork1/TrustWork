import WS from 'react-native-websocket';
import constants from './helpers/constants';

const createSocketConnection = token => {
  const socket = WS(constants.SOCKET_URL, {
    extraHeaders: {
      authorization: `Token ${token}` || '',
    },
  });
  console.log(socket);
  // return socket;
};

export default createSocketConnection;
