import { useState } from 'react';
import { useGetUserProfile } from '../../hooks/user/useGetUserProfile';

/**
 * COMMIT 1: Removed unnecessary useMemo/useCallback hooks
 * 
 * Why removed:
 * - useMemo for string concatenation adds overhead that outweighs benefit
 * - useCallback for button handlers not passed to memoized children
 * 
 * Trade-off: Slight increase in string allocations per render (negligible)
 */
const UserProfile = () => {
  const { data: user, isLoading } = useGetUserProfile();
  const [localCounter, setLocalCounter] = useState(0);

  // String concatenation is cheap - no need for useMemo
  const userName = !user ? 'Loading...' : `${user.firstName} ${user.lastName}`;

  // Direct function - not passed to memoized children
  const handleClick = () => {
    setLocalCounter((prev) => prev + 1);
  };

  // Simple ternary - no need for useMemo
  const displayName = user ? `${user.firstName} ${user.lastName}` : 'Guest';

  // Helper function for initials - still fast, no need for memoization
  const userInitials = !user ? '??' : `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();

  // Direct function - only used once, not passed as prop
  const handleNameClick = () => {
    console.log('Name clicked:', displayName);
  };

  if (isLoading) {
    return <div>Loading profile...</div>;
  }

  return (
    <div style={{ padding: '20px' }}>
      <h1>User Profile</h1>
      <div>
        <p>Name: {userName}</p>
        <p>Display Name: {displayName}</p>
        <p>Initials: {userInitials}</p>
        <button onClick={handleClick}>Counter: {localCounter}</button>
        <button onClick={handleNameClick}>Log Name</button>
      </div>
    </div>
  );
};

export default UserProfile;
