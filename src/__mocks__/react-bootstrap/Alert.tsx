import React from 'react';

type AlertProps = {
  children?: React.ReactNode;
  variant?: string;
};

const Alert = ({ children }: AlertProps) => <div>{children}</div>;

export default Alert;
