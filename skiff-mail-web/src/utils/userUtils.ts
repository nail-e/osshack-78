import { isAndroid, isIOS, isMacOs, isMobile } from 'react-device-detect';
import {
  GetSubscriptionInfoDocument,
  GetSubscriptionInfoQuery,
  GetSubscriptionInfoQueryVariables,
  GetUserProfileDataDocument,
  GetUserProfileDataQuery,
  GetUserProfileDataQueryVariables,
  GetUsersProfileDataDocument,
  GetUsersProfileDataQuery,
  GetUsersProfileDataQueryVariables,
  StoreWorkspaceEventDocument,
  StoreWorkspaceEventMutation,
  StoreWorkspaceEventMutationVariables,
  USER_NOT_FOUND,
  UpdateDisplayNameDocument,
  UserID,
  models,
  useGetSubscriptionInfoQuery
} from 'skiff-front-graphql';
import { formatName, requireCurrentUserData, saveCurrentUserData, splitEmailToAliasAndDomain } from 'skiff-front-utils';
import {
  RequestStatus,
  SubscriptionPlan,
  User,
  WorkspaceEventType,
  getTierNameFromSubscriptionPlan
} from 'skiff-graphql';
import { isENSName } from 'skiff-utils';
import isEthereumAddress from 'validator/lib/isEthereumAddress';

import { getENSNameFromEthAddr } from 'skiff-front-utils';
import client from '../apollo/client';


/**
 * Return user profile data from query
 * @param {string} userID - userID
 * @param {boolean | undefined} forceNetwork - policy to force network for gql request
 */
export async function getUserProfileFromID(userID: string, forceNetwork = false) {
  const userProfileDataQueryRes = await client.query<GetUserProfileDataQuery, GetUserProfileDataQueryVariables>({
    query: GetUserProfileDataDocument,
    variables: {
      request: {
        userID
      }
    },
    fetchPolicy: forceNetwork ? 'network-only' : 'cache-first'
  });
  return userProfileDataQueryRes;
}

/**
 * @param {WorkspaceEventType} eventName - name of the event.
 * @param {string} data - data to be reported, i.e. a step index
 * @param {string} version - semver version number for the frontend feature.
 * @returns {Promise<RequestStatus | null>} gql mutation status.
 */
export async function storeWorkspaceEvent(eventName: WorkspaceEventType, data: string, version: string) {
  await client.mutate<StoreWorkspaceEventMutation, StoreWorkspaceEventMutationVariables>({
    mutation: StoreWorkspaceEventDocument,
    variables: {
      request: {
        eventName,
        data,
        version,
        platformInfo: {
          isMobile: isMobile,
          isIos: isIOS,
          isAndroid: isAndroid,
          isMacOs: isMacOs,
          isReactNative: !!window.ReactNativeWebView,
          isSkiffWindowsDesktop: !!window.IsSkiffWindowsDesktop
        }
      }
    }
  });
}

/**
 * Returns the display picture data object given a user
 * if it exists.
 * @param user the User object we want to get the avatar image for.
 */
export const getDisplayPictureDataFromUser = (user?: Pick<Partial<User>, 'publicData'> | null) => {
  return user?.publicData?.displayPictureData;
};

// If the given string is a display name, return the first name in the display name.
// i.e name = "Display Name" will return "Display"
// If the given string is an email address, return the entire email address.
export const getFirstNameOrEmail = (name: string | undefined) => {
  if (!name) return '';
  return name.split(' ')[0];
};

/**
 * Returns the formatted and raw display names given a user
 * @param user the User object we want to get the display name for.
 * we only require either the username or publicData of the user in
 * order to accommodate the different User types
 * @param defaultName the default display name
 * @returns the formatted and raw display names of the user
 */
export const getDisplayNameFromUser = (
  user?: Pick<User, 'username'> | Pick<User, 'publicData'> | null,
  defaultName?: string
) => {
  let displayName = defaultName || USER_NOT_FOUND;
  if (user && 'publicData' in user && user.publicData.displayName) {
    displayName = user.publicData.displayName;
  } else if (user && 'username' in user && user.username) {
    displayName = user.username;
  }
  return {
    displayName,
    formattedDisplayName: formatName(displayName)
  };
};

/**
 * Fetches all public data about users by ID
 * @param {Array<UserID>} userIDs array of target user IDs
 * @param {any} dispatch - redux dispatch fn
 * @returns {Promise<User[]>} array of objects containing usernames and publicData blobs for each user
 */
export async function fetchUserProfileDataFromIDs(userIDs: Array<string>) {
  const profileDataResponse = await client.query<GetUsersProfileDataQuery, GetUsersProfileDataQueryVariables>({
    query: GetUsersProfileDataDocument,
    variables: {
      request: {
        userIDs
      }
    }
  });

  const { users } = profileDataResponse.data;

  if (!users) {
    console.error('FetchUsersPublicData: Request failed.');
    return null;
  }

  return users;
}

/**
 * Update user displayName
 * @param {UserID} userID - current user ID
 * @param {String} displayName - new display name
 * @param {any} dispatch - redux dispatch fn
 * @returns {RequestStatus} - gql mutation status
 */
export async function setDisplayName(userID: UserID, displayName: string): Promise<RequestStatus> {
  const updateResponse = await client.mutate({
    mutation: UpdateDisplayNameDocument,
    variables: {
      request: {
        displayName
      }
    },
    // We use the GetUsersProfileDataDocument query to populate the user's display name for other components, so we want to
    // refetch that data to make sure we capture the changes from the mutation. The next time a component that uses
    // GetUsersProfileDataDocument loads, it will make a network call instead of using the cached result.
    refetchQueries: [{ query: GetUsersProfileDataDocument, variables: { request: { userIDs: [userID] } } }]
  });

  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
  const { status } = updateResponse.data.updateDisplayName;
  if (status !== RequestStatus.Success) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return status;
  }

  // trigger local state update
  await fetchUserProfileDataFromIDs([userID]);
  const currentUserData = requireCurrentUserData();
  saveCurrentUserData({
    ...currentUserData,
    publicData: {
      ...(currentUserData.publicData ?? {}),
      displayName
    }
  });

  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return status;
}

/**
 * If the user does not have a display name set, update the display name so
 * that it is in sync with the default email alias -- ie if the default email is a wallet address
 * with a linked ens name, update the display name to be the ens name
 * @param defaultEmail the email to base the display name off of
 * @param user the user to update the display name for
 */
export const resolveAndSetENSDisplayName = async (defaultEmail: string, user: models.User) => {
  const { publicData } = user;

  // Update the display name so that it is in sync with the default email alias
  // If there's no display name set, check if we can default to the linked ENS name
  const ensName = await resolveENSName(defaultEmail, publicData?.displayName);
  if (ensName) {
    await setDisplayName(user.userID, ensName);
  }
};

/**
 * If there is no current display name, get the ENS name linked tot he default email (if applicable)
 * @param defaultEmail the default email of the user
 * @param currDisplayName the current display name
 * @returns the resolved ENS name if there is one linked, otherwise undefined
 */
export const resolveENSName = async (defaultEmail: string, currDisplayName?: string | null) => {
  if (!currDisplayName) {
    const { alias } = splitEmailToAliasAndDomain(defaultEmail);
    const isEthAddress = isEthereumAddress(alias);
    if (isEthAddress) {
      return getENSNameFromEthAddr(alias);
    } else if (isENSName(alias)) {
      return alias;
    }
  }
  return undefined;
};

export const getSubscriptionPlan = async () => {
  const res = await client.query<GetSubscriptionInfoQuery, GetSubscriptionInfoQueryVariables>({
    query: GetSubscriptionInfoDocument,
    variables: {}
  });

  const tierName = res.data?.currentUser?.subscriptionInfo.subscriptionPlan;
  const isCryptoSubscription = res.data?.currentUser?.subscriptionInfo.isCryptoSubscription;
  const isAppleSubscription = res.data.currentUser?.subscriptionInfo.isAppleSubscription;
  const isGoogleSubscription = res.data.currentUser?.subscriptionInfo.isGoogleSubscription;
  const activeSubscription = tierName
    ? SubscriptionPlan[tierName as keyof typeof SubscriptionPlan]
    : SubscriptionPlan.Free;
  const cancelAtPeriodEnd = res.data?.currentUser?.subscriptionInfo.cancelAtPeriodEnd;
  const supposedEndDate = res.data?.currentUser?.subscriptionInfo.supposedEndDate;
  const stripeStatus = res.data?.currentUser?.subscriptionInfo.stripeStatus;
  const billingInterval = res.data?.currentUser?.subscriptionInfo.billingInterval;
  return {
    ...res,
    data: {
      activeSubscription,
      isCryptoSubscription,
      isAppleSubscription,
      isGoogleSubscription,
      cancelAtPeriodEnd,
      supposedEndDate,
      stripeStatus,
      billingInterval
    }
  };
};

export function useSubscriptionPlan() {
  const res = useGetSubscriptionInfoQuery();
  const tierName = res.data?.currentUser?.subscriptionInfo.subscriptionPlan;
  const isCryptoSubscription = res.data?.currentUser?.subscriptionInfo.isCryptoSubscription;
  const isAppleSubscription = res.data?.currentUser?.subscriptionInfo.isAppleSubscription;
  const isGoogleSubscription = res.data?.currentUser?.subscriptionInfo.isGoogleSubscription;
  const activeSubscription = tierName
    ? SubscriptionPlan[tierName as keyof typeof SubscriptionPlan]
    : SubscriptionPlan.Free;
  const cancelAtPeriodEnd = res.data?.currentUser?.subscriptionInfo.cancelAtPeriodEnd;
  const supposedEndDate = res.data?.currentUser?.subscriptionInfo.supposedEndDate;
  const stripeStatus = res.data?.currentUser?.subscriptionInfo.stripeStatus;
  const billingInterval = res.data?.currentUser?.subscriptionInfo.billingInterval;
  return {
    ...res,
    data: {
      activeSubscription,
      isCryptoSubscription,
      isAppleSubscription,
      isGoogleSubscription,
      cancelAtPeriodEnd,
      supposedEndDate,
      stripeStatus,
      billingInterval
    }
  };
}

export const getTierName = async () => {
  const {
    data: { activeSubscription }
  } = await getSubscriptionPlan();
  return getTierNameFromSubscriptionPlan(activeSubscription);
};
