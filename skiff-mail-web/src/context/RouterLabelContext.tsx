import { createContext, useContext } from 'react';
import { SystemLabels } from 'skiff-graphql';

import { LABEL_TO_SYSTEM_LABEL, Label } from '../utils/label';
import { SystemLabel } from '../utils/label';

const InboxSystemLabel = LABEL_TO_SYSTEM_LABEL[SystemLabels.Inbox];

export const FALLBACK_ROUTER_LABEL: SystemLabel = InboxSystemLabel;

// If route can't be parsed into label, default fallback to inbox
export const RouterLabelContext = createContext<Label>(FALLBACK_ROUTER_LABEL);

export const useRouterLabelContext = () => useContext(RouterLabelContext);
