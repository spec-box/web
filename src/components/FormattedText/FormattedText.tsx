import { FC, MouseEvent, ReactNode, useCallback, useContext } from "react";
import reactStringReplace from "react-string-replace";

import {
  OpenFeatureLinkEventHandler,
  ProjectContext,
} from "@/components/ProjectContext/ProjectContext";
import { RouteLink } from "@/components/RouteLink/RouteLink";
import { projectRoute } from "@/model";
import { cn } from "@bem-react/classname";

const bem = cn("FormattedText");

type FormattedTextProps = {
  className?: string;
  text: string;
};

interface FormattedValueProps {
  children: ReactNode;
}

const FormattedValue: FC<FormattedValueProps> = ({ children }) => (
  <code>{children}</code>
);

interface FeatureLinkProps {
  project: string;
  feature: string;
  navigate?: OpenFeatureLinkEventHandler;
}

function isModifiedEvent(
  event: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement>
) {
  return !!(event.metaKey || event.altKey || event.ctrlKey || event.shiftKey);
}

const FeatureLink: FC<FeatureLinkProps> = ({ project, feature, navigate }) => {
  const onClick = useCallback(
    (e: MouseEvent<HTMLAnchorElement | HTMLButtonElement>) => {
      if (
        navigate &&
        !e.defaultPrevented && // onClick prevented default
        e.button === 0 && // ignore everything but left clicks
        !isModifiedEvent(e) // ignore clicks with modifier keys
      ) {
        e.preventDefault();
        navigate(project, feature);
      }
    },
    [project, feature, navigate]
  );

  return (
    <RouteLink
      to={projectRoute}
      params={{ project }}
      query={{ feature }}
      onClick={onClick}
    >
      {feature}
    </RouteLink>
  );
};

export const FormattedText: FC<FormattedTextProps> = (props) => {
  const { className, text } = props;

  const { project, navigate } = useContext(ProjectContext) || {};

  // Match URLs
  // для корректной замены в регулярном выражении должна быть ровно одна группа
  let replacedText = reactStringReplace(
    text,
    /(https?:\/\/\S+)/gi,
    (match, i) => <FormattedValue key={match + i}>{match}</FormattedValue>
  );

  // Match relative paths
  replacedText = reactStringReplace(replacedText, /\s(\/\S+)/g, (match, i) => (
    <FormattedValue key={match + i}>{match}</FormattedValue>
  ));

  // Match $-mentions
  replacedText = reactStringReplace(
    replacedText,
    /\$([A-Za-z][A-Za-z0-9-_]*)/g,
    (feature, i) => {
      return project ? (
        <FeatureLink
          key={feature + i}
          project={project}
          feature={feature}
          navigate={navigate}
        />
      ) : (
        <FormattedValue key={feature + i}>${feature}</FormattedValue>
      );
    }
  );

  return <span className={bem(null, [className])}>{replacedText}</span>;
};
