// Path: frontend/src/pages/Dashboard.js
import React from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import axios from 'axios';
import UserInfo from '../components/UserInfo';
import FollowersList from '../components/FollowersList';
import PostsList from '../components/PostsList';
import TrackProfileForm from '../components/TrackProfileForm';
import TrackedProfilesList from '../components/TrackedProfilesList';
import NotificationsList from '../components/NotificationsList';
import useSocket from '../hooks/useSocket';

const Dashboard = () => {
  const queryClient = useQueryClient();

  const { data: userData, error: userError, isLoading: userLoading } = useQuery(
    'userData',
    () => axios.get('https://dodo-sterling-globally.ngrok-free.app/api/data', { withCredentials: true }).then(res => res.data)
  );

  const { data: followersData, error: followersError, isLoading: followersLoading } = useQuery(
    'followers',
    () => axios.get('https://dodo-sterling-globally.ngrok-free.app/api/followers', { withCredentials: true }).then(res => res.data)
  );

  const { data: postsData, error: postsError, isLoading: postsLoading } = useQuery(
    'posts',
    () => axios.get('https://dodo-sterling-globally.ngrok-free.app/api/posts', { withCredentials: true }).then(res => res.data)
  );

  const { data: trackedProfilesData, error: trackedError, isLoading: trackedLoading } = useQuery(
    'trackedProfiles',
    () => axios.get('https://dodo-sterling-globally<|control517|>.ngrok-free.app/api/tracked-profiles', { withCredentials: true }).then(res => res.data)
  );

  const { data: notificationsData, error: notificationsError, isLoading: notificationsLoading } = useQuery(
    'notifications',
    () => axios.get('https://dodo-sterling-globally.ngrok-free.app/api/notifications', { withCredentials: true }).then(res => res.data)
  );

  const trackProfileMutation = useMutation(
    (profileData) => axios.post('https://dodo-sterling-globally.ngrok-free.app/api/track-profile', profileData, { withCredentials: true }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('trackedProfiles');
      },
    }
  );

  // Usar o hook useSocket para gerenciar notificações em tempo real
  const { notifications: socketNotifications } = useSocket(userData?.user?._id);

  const handleTrackProfile = (profileData) => {
    trackProfileMutation.mutate(profileData);
  };

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <h1>Dashboard</h1>
      <UserInfo user={userData?.user} />
      <NotificationsList
        notifications={notificationsData?.notifications}
        isLoading={notificationsLoading}
        error={notificationsError}
        socketNotifications={socketNotifications}
      />
      <FollowersList
        followers={followersData?.followers}
        isLoading={followersLoading}
        error={followersError}
      />
      <PostsList
        posts={postsData?.posts}
        isLoading={postsLoading}
        error={postsError}
      />
      <TrackProfileForm onTrackProfile={handleTrackProfile} />
      <TrackedProfilesList
        trackedProfiles={trackedProfilesData?.trackedProfiles}
        isLoading={trackedLoading}
        error={trackedError}
      />
    </div>
  );
};

export default Dashboard;