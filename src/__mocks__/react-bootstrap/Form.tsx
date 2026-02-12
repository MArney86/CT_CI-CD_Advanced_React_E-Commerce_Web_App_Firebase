import React from 'react';

type FormProps = {
  children?: React.ReactNode;
};

type ControlProps = React.InputHTMLAttributes<HTMLInputElement>;

const Form = ({ children }: FormProps) => <form>{children}</form>;
Form.Group = ({ children }: FormProps) => <div>{children}</div>;
Form.Label = ({ children }: FormProps) => <label>{children}</label>;
Form.Control = (props: ControlProps) => <input {...props} />;

export default Form;
