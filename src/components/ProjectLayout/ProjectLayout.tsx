import { FC, ReactNode } from "react";
import { cn } from "@bem-react/classname";

import {
  ProjectContext,
  OpenFeatureLinkEventHandler,
} from "@/components/ProjectContext/ProjectContext";

import "./ProjectLayout.css";

const bem = cn("ProjectLayout");

type ProjectLayoutProps = {
  project: string;
  navigate: OpenFeatureLinkEventHandler;
  contentClassName?: string;
  children?: ReactNode;
};

export const ProjectLayout: FC<ProjectLayoutProps> = (props) => {
  const { children, contentClassName, navigate, project } = props;

  return (
    <ProjectContext.Provider value={{ project, navigate }}>
      <div className={bem()}>
        <div className={bem("Header")}>111</div>
        <div className={bem("Content", [contentClassName])}>{children}</div>
      </div>
    </ProjectContext.Provider>
  );
};
