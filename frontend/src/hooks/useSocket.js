// Path: frontend/src/hooks/useSocket.js
import { useEffect, useState } from 'react';
import io from 'socket.io-client';

const useSocket = (userId) => {
  const [socket, setSocket] = useState(null);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    if (!userId) return;

    const newSocket = io('https://dodo-sterling-globally.ngrok-free.app', {
      withCredentials: true,
    });

    newSocket.on('connect', () => {
      console.log('Conectado ao servidor WebSocket');
      newSocket.emit('join', userId);
    });

    newSocket.on('notification', (notification) => {
      setNotifications((prev) => [notification, ...prev]);
    });

    newSocket.on('disconnect', () => {
      console.log('Desconectado do servidor WebSocket');
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, [userId]);

  return { socket, notifications };
};

export default useSocket;