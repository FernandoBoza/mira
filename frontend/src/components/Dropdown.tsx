import { Dispatch, useEffect, useState } from 'react';
import { ChevronDownIcon, ClockIcon } from '../assets/icons';

type DropdownProps = {
  clientCenter: { id: number; name: string };
  currentlyOpen: number | null;
  setCurrentlyOpen: Dispatch<number | null>;
};

export const DropDown = ({
  clientCenter,
  currentlyOpen,
  setCurrentlyOpen,
}: DropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);

  // For multiple chofice refactor useEffect to stop listening for individual clicks
  useEffect(() => {
    setIsOpen(currentlyOpen === clientCenter.id);
  }, [currentlyOpen, clientCenter.id]);

  function handleSelectCenter() {
    if (currentlyOpen !== clientCenter.id) {
      setCurrentlyOpen(clientCenter.id);
    } else {
      setCurrentlyOpen(null);
    }
  }

  return (
    <div className="dropdown-wrapper">
      <div
        onClick={handleSelectCenter}
        className={`dropdown ${isOpen && 'selected'}`}
      >
        {isOpen ? 'selected' : 'Select Client'}
        {ChevronDownIcon}
      </div>
      {ClockIcon}
    </div>
  );
};
