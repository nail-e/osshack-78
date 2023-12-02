import { Dropdown, DropdownItem } from 'nightwatch-ui';

import { DROPDOWN_ANCHOR_GAP, ConditionType, CONDITION_TYPE_TO_LABEL } from '../Filters.constants';
import { getAvailableConditionTypes } from '../Filters.utils';

interface ConditionTypeDropdownProps {
  buttonRef: React.MutableRefObject<HTMLDivElement | null>;
  setShowDropdown: (state: boolean) => void;
  showDropdown: boolean;
  onClickConditionType: (type: ConditionType) => void;
  isTypeActive?: (type: ConditionType) => boolean;
}

export const ConditionTypeDropdown: React.FC<ConditionTypeDropdownProps> = ({
  buttonRef,
  setShowDropdown,
  showDropdown,
  onClickConditionType,
  isTypeActive
}: ConditionTypeDropdownProps) => {
  const availableConditionTypes = getAvailableConditionTypes();

  return (
    <Dropdown
      buttonRef={buttonRef}
      gapFromAnchor={DROPDOWN_ANCHOR_GAP}
      portal
      setShowDropdown={setShowDropdown}
      showDropdown={showDropdown}
    >
      {availableConditionTypes.map((type) => (
        <DropdownItem
          active={isTypeActive ? isTypeActive(type) : false}
          key={type}
          label={CONDITION_TYPE_TO_LABEL[type]}
          onClick={() => {
            onClickConditionType(type);
            setShowDropdown(false);
          }}
          value={type}
        />
      ))}
    </Dropdown>
  );
};
