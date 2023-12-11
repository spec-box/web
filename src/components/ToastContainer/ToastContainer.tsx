import { FC } from 'react';
import {
  ToastContainer as ToastContainerBase,
  ToastContainerProps as ToastContainerPropsBase,
} from 'react-toastify';

import { cn } from '@bem-react/classname';

import 'react-toastify/dist/ReactToastify.css';

const cnToastify = cn('Toastify');

export type ToastContainerProps = Omit<ToastContainerPropsBase, 'icon' | 'theme' | 'className'> & {
  className?: string;
};

export const ToastContainer: FC<ToastContainerProps> = (props) => {
  const { className, ...other } = props;

  return (
    <ToastContainerBase
      className={cnToastify({ view: 'hr' }, [className])}
      hideProgressBar
      closeButton={false}
      icon={false}
      autoClose={3000}
      theme="colored"
      position="top-right"
      {...other}
    />
  );
};
