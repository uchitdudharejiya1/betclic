import {useContext} from 'react';

import {SocketContext} from '../provider/SocketContext';

export const useSocket = () => useContext(SocketContext);
