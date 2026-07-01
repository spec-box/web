import { createRouteView, createRoutesView } from '@virentia/router-react';
import { FC } from 'react';

import { ApplicationLayout } from './components/ApplicationLayout/ApplicationLayout';
import { ToastContainer } from './components/ToastContainer/ToastContainer';
import { homeRoute, projectRoute, statRoute } from './model';
import { Home } from './pages/Home/Home';
import { Project } from './pages/Project/Project';
import { Stat } from './pages/Stat/Stat';

const Routes = createRoutesView({
  routes: [
    createRouteView({ route: homeRoute, view: Home }),
    createRouteView({ route: projectRoute, view: Project }),
    createRouteView({ route: statRoute, view: Stat }),
  ],
});

export const Application: FC = () => {
  return (
    <ApplicationLayout>
      <Routes />
      <ToastContainer />
    </ApplicationLayout>
  );
};
