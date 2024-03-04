import { type FC, type MouseEvent, useCallback, type ReactNode, useContext } from 'react';

import { RouteLink } from '@/components/RouteLink/RouteLink';
import { ProjectContext } from '@/components/ProjectContext/ProjectContext';
import { type PressEvent } from '@/hooks/usePress';
import { projectRoute } from '@/model';

export interface FeatureLinkProps {
  children: ReactNode;
  feature: string;
}

export const FeatureLink: FC<FeatureLinkProps> = (props) => {
  const { children, feature } = props;

  const { project, navigate } = useContext(ProjectContext) ?? {};

  const onPress = useCallback(
    (event: PressEvent) => {
      if (event.type === 'mouse') {
        if (
          event.source.defaultPrevented || // onClick prevented default
          event.source.button !== 0 || // ignore everything but left clicks
          isModifiedEvent(event.source) // ignore clicks with modifier keys)
        ) {
          return;
        }
      }

      if (navigate && project) {
        event.source.preventDefault();
        navigate(project, feature);
      }
    },
    [project, feature, navigate],
  );

  return (
    <RouteLink onPress={onPress} params={{ project }} query={{ feature }} to={projectRoute}>
      {children}
    </RouteLink>
  );
};

function isModifiedEvent(event: MouseEvent) {
  return !!(event.metaKey || event.altKey || event.ctrlKey || event.shiftKey);
}
