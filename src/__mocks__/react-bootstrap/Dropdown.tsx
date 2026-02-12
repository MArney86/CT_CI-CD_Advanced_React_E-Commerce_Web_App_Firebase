import React from 'react';

type DropdownProps = {
  children?: React.ReactNode;
};

const Dropdown = ({ children }: DropdownProps) => <div>{children}</div>;
const DropdownItem = ({ children }: DropdownProps) => <div>{children}</div>;

Dropdown.Item = DropdownItem;

export default Dropdown;
