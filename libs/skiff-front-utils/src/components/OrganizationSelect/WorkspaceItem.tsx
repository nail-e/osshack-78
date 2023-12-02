import { Icon, Icons, ThemeMode, Typography, TypographySize, TypographyWeight } from 'nightwatch-ui';
import { useState } from 'react';

import { UserAvatar } from '../UserAvatar';

import {
  ActiveCheck,
  UnreadBadge,
  WorkspaceAvatar,
  WorkspaceItemContainer,
  WorkspaceLabels,
  WorkspaceOptionItem
} from './OrganizationSelect.constants';

interface WorkspaceItemProps {
  closeDropdown: () => void;
  workspace: WorkspaceOptionItem;
}

export const WorkspaceItem = (props: WorkspaceItemProps) => {
  const { closeDropdown, workspace } = props;
  const [hover, setHover] = useState(false);
  const { orgAvatar, userAvatar, label, sublabel, id } = workspace;

  return (
    <WorkspaceItemContainer
      $disabled={workspace?.active}
      id={id}
      onClick={() => {
        if (workspace?.active) return;
        workspace.onClick();
        closeDropdown();
      }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <WorkspaceAvatar $active={workspace?.active || hover}>
        <UserAvatar displayPictureData={orgAvatar || userAvatar} forceTheme={ThemeMode.DARK} label={label} />
      </WorkspaceAvatar>
      <WorkspaceLabels>
        <Typography
          color={workspace?.active || hover ? 'primary' : 'secondary'}
          forceTheme={ThemeMode.DARK}
          size={TypographySize.SMALL}
        >
          {label}
        </Typography>
        {sublabel && (
          <Typography
            color={hover && !workspace?.active ? 'primary' : 'disabled'}
            forceTheme={ThemeMode.DARK}
            size={TypographySize.CAPTION}
          >
            {sublabel}
          </Typography>
        )}
      </WorkspaceLabels>
      {workspace?.active && (
        <ActiveCheck>
          <Icons color='white' icon={Icon.Check} />
        </ActiveCheck>
      )}
      {!workspace?.active && (workspace?.numUnread || 0) > 0 && (
        <ActiveCheck>
          <UnreadBadge>
            <Typography forceTheme={ThemeMode.DARK} weight={TypographyWeight.MEDIUM} size={TypographySize.CAPTION}>
              {workspace?.numUnread}
            </Typography>
          </UnreadBadge>
        </ActiveCheck>
      )}
      {workspace?.warning && (
        <ActiveCheck>
          <Icons color='disabled' forceTheme={ThemeMode.DARK} icon={Icon.Warning} />
        </ActiveCheck>
      )}
    </WorkspaceItemContainer>
  );
};
