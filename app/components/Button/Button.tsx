import { ButtonHTMLAttributes, DetailedHTMLProps } from 'react';
import styles from './button.module.css';
import classNames from 'classnames';

type ButtonProps = DetailedHTMLProps<
  ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
> & {
  children: React.ReactNode;
};

export const Button = (props: ButtonProps) => {
  return (
    <button {...props} className={classNames(props.className, styles.button)}>
      {props.children}
    </button>
  );
};
