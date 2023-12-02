import { Icon } from 'nightwatch-ui';
import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { SystemLabels } from 'skiff-graphql';

import { useCurrentLabel } from '../../../hooks/useCurrentLabel';
import { useThreadActions } from '../../../hooks/useThreadActions';
import { MailboxThreadInfo } from '../../../models/thread';
import { skemailMobileDrawerReducer } from '../../../redux/reducers/mobileDrawerReducer';
import { skemailModalReducer } from '../../../redux/reducers/modalReducer';
import { LABEL_TO_SYSTEM_LABEL } from '../../../utils/label';

import ToolbarButton from './ToolbarButton';
interface ThreadToolbarProps {
  thread: MailboxThreadInfo;
}

export const ThreadToolbar = ({
  thread: {
    threadID,
    attributes: { systemLabels }
  }
}: ThreadToolbarProps) => {
  const { label } = useCurrentLabel();
  const dispatch = useDispatch();

  const { trashThreads, moveThreads } = useThreadActions();

  const isTrash = systemLabels.includes(SystemLabels.Trash);
  const isDraft = systemLabels.includes(SystemLabels.Drafts);

  const showReplyDrawer = () => {
    dispatch(skemailMobileDrawerReducer.actions.setShowReplyDrawer(true));
  };
  const onRestoreClick = useCallback(
    () => moveThreads([threadID], LABEL_TO_SYSTEM_LABEL[SystemLabels.Inbox], systemLabels),
    [moveThreads, threadID, systemLabels]
  );
  const onTrashClick = useCallback(
    () => trashThreads([threadID], isDraft, undefined, label ?? undefined),
    [isDraft, threadID, trashThreads, label]
  );
  const showShowMoveThread = useCallback(
    () => dispatch(skemailMobileDrawerReducer.actions.setShowMoveThreadDrawer(true)),
    [dispatch]
  );
  const onComposeClick = () => dispatch(skemailModalReducer.actions.openEmptyCompose());

  return (
    <>
      {isTrash && <ToolbarButton icon={Icon.Inbox} onClick={() => void onRestoreClick()} />}
      {!isTrash && <ToolbarButton icon={Icon.Trash} onClick={() => void onTrashClick()} />}
      <ToolbarButton icon={Icon.FolderArrow} onClick={showShowMoveThread} />
      <ToolbarButton icon={Icon.Reply} onClick={showReplyDrawer} />
      <ToolbarButton icon={Icon.Compose} onClick={onComposeClick} />
    </>
  );
};
