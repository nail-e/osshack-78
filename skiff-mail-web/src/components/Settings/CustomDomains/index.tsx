import { Icon } from 'nightwatch-ui';
import React, { Suspense, useState, useCallback } from 'react';
import { useGetCurrentUserCustomDomainsQuery } from 'skiff-front-graphql';
import { Setting, SETTINGS_LABELS, SettingType, SettingValue, PLAN_CHANGE_POLL_INTERVAL } from 'skiff-front-utils';
import { insertIf } from 'skiff-utils';

import { usePollForPurchasedDomain } from '../../../hooks/usePollForPurchasedDomain';

import SetupCustomDomain from './SetupCustomDomain';

const ManageCustomDomains = React.lazy(() => import('./Manage/ManageCustomDomains'));

export const useCustomDomainsSettings = (): Setting[] => {
  // whether we're polling for a newly purchased Skiff Domain
  const [isPolling, setIsPolling] = useState(false);

  const { data, loading, refetch, startPolling, stopPolling } = useGetCurrentUserCustomDomainsQuery();
  const customDomains = data?.getCurrentUserCustomDomains.domains;

  // poll for a newly purchased Skiff Domain after Stripe checkout
  usePollForPurchasedDomain({
    isPolling,
    customDomains,
    setIsPolling,
    startPolling: () => void startPolling(PLAN_CHANGE_POLL_INTERVAL),
    stopPolling: () => void stopPolling()
  });

  const refetchCustomDomains = useCallback(() => void refetch(), [refetch]);

  return [
    {
      type: SettingType.Custom,
      value: SettingValue.CustomDomainSetup,
      component: (
        <SetupCustomDomain
          existingCustomDomains={customDomains ?? []}
          key='custom-domain-setup'
          refetchCustomDomains={refetchCustomDomains}
        />
      ),
      label: SETTINGS_LABELS[SettingValue.CustomDomainSetup],
      icon: Icon.At,
      color: 'red'
    },
    ...insertIf(!!customDomains?.length || isPolling, {
      type: SettingType.Custom,
      value: SettingValue.CustomDomainManage,
      component: (
        <Suspense fallback={<></>}>
          <ManageCustomDomains
            customDomains={customDomains}
            isPolling={isPolling}
            key='manage-custom-domains'
            loading={loading}
            refetchCustomDomains={refetchCustomDomains}
          />
        </Suspense>
      ),
      label: SETTINGS_LABELS[SettingValue.CustomDomainManage],
      icon: Icon.At,
      color: 'blue'
    } as Setting)
  ];
};
