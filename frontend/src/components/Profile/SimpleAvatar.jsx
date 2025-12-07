import React from 'react';

const SimpleAvatar = ({ username, size = 64 }) => {
  const seed = encodeURIComponent(username.toLowerCase());

  const avatarUrl = `https://api.dicebear.com/8.x/fun-emoji/svg?seed=${seed}&size=${size}&backgroundColor=00d5be`;

  return (
    <img
      src={avatarUrl}
      alt={`${username}'s avatar`}
      style={{
        width: size,
        height: size,
        borderRadius: '50%'
      }}
    />
  );
};

export default SimpleAvatar;
