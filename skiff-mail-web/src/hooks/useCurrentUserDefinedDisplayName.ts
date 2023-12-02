import { useUserProfile } from 'skiff-front-graphql';
import { useRequiredCurrentUserData } from 'skiff-front-utils';

/**
 * This hook is the source of truth for getting the most up-to-date display name
 * that the user has set. We can't rely on the `currentUserData` store because
 * that object is created from localStorage on `useCachedLogin` and the publicData
 * can get stale
 */
export const useCurrentUserDefinedDisplayName = () => {
  const { userID } = useRequiredCurrentUserData();
  const { data, loading } = useUserProfile(userID);

  return loading ? undefined : data?.publicData.displayName;
};
