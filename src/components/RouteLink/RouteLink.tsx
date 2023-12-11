import { RouteParams } from 'atomic-router';
import { Link, LinkProps } from 'atomic-router-react/scope';

import { cn } from '@bem-react/classname';

import './RouteLink.css';

const bem = cn('RouteLink');

export function RouteLink<T extends RouteParams>({ className, ...props }: LinkProps<T>) {
  return <Link className={bem(null, className)} {...props} />;
}
