import { createContext } from 'react';

export type OpenFeatureLinkEventHandler = (project: string, feature: string) => void;

export interface ProjectContextValue {
  project: string;
  navigate?: OpenFeatureLinkEventHandler;
}

export const ProjectContext = createContext<ProjectContextValue | undefined>(undefined);
