// Path: frontend/src/components/NotificationsList.js
import React from 'react';
import axios from 'axios';
import { useMutation, useQueryClient } from 'react-query';

const NotificationsList = ({ notifications: initialNotifications, isLoading, error, socketNotifications }) => {
  const queryClient = useQueryClient();

  // Combinar notificações iniciais com as recebidas via WebSocket
  const allNotifications = [...socketNotifications, ...(initialNotifications || [])];

  const markAsReadMutation = useMutation(
    (notificationId) => axios.put(`https://dodo-sterling-globally.ngrok-free.app/api/notification/read/${notificationId}`, {}, { withCredentials: true }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('notifications');
      },
    }
  );

  const clearNotificationsMutation = useMutation(
    () => axios.delete('https://dodo-sterling-globally.ngrok-free.app/api/notifications/clear', { withCredentials: true }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('notifications');
      },
    }
  );

  const handleMarkAsRead = (notificationId) => {
    markAsReadMutation.mutate(notificationId);
  };

  const handleClearNotifications = () => {
    clearNotificationsMutation.mutate();
  };

  if (isLoading) return <div>Carregando notificações...</div>;
  if (error) return <div style={{ color: 'red' }}>Erro ao carregar notificações: {error.message}</div>;

  return (
    <div style={{ marginBottom: '20px' }}>
      <h2>Notificações</h2>
      {allNotifications.length > 0 ? (
        <>
          <button
            onClick={handleClearNotifications}
            style={{ padding: '5px 10px', background: '#ff4444', color: 'white', border: 'none', borderRadius: '4px', marginBottom: '10px' }}
          >
            Limpar Notificações
          </button>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {allNotifications.map(notification => (
              <li
                key={notification._id}
                style={{
                  padding: '10px',
                  borderBottom: '1px solid #ddd',
                  background: notification.read ? '#f0f0f0' : '#fff',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <div>
                  <p>{notification.message}</p>
                  <small>{new Date(notification.createdAt).toLocaleString()}</small>
                </div>
                {!notification.read && (
                  <button
                    onClick={() => handleMarkAsRead(notification._id)}
                    style={{ padding: '5px 10px', background: '#4CAF50', color: 'white', border: 'none', borderRadius: '4px' }}
                  >
                    Marcar como Lida
                  </button>
                )}
              </li>
            ))}
          </ul>
        </>
      ) : (
        <p>Nenhuma notificação.</p>
      )}
    </div>
  );
};

export default NotificationsList;