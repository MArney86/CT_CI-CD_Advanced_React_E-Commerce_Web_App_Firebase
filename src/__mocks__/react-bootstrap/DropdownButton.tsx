import React from 'react';

type DropdownButtonProps = {
  children?: React.ReactNode;
  title?: React.ReactNode;
  onToggle?: (open: boolean) => void;
  show?: boolean;
};

const DropdownButton = ({ children, title, onToggle, show }: DropdownButtonProps) => (
  <div>
    <button
      type="button"
      onClick={() => onToggle?.(!show)}
    >
      {title}
    </button>
    <div>{children}</div>
  </div>
);

export default DropdownButton;
