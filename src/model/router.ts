import { createRouter } from '@virentia/router';

import { controls } from './common';
import { homeRoute } from './pages/home';
import { projectRoute } from './pages/project';
import { statRoute } from './pages/stat';

// сопоставление путей и роутов; сам history подключается в RouterProvider
export const router = createRouter({
  controls,
  routes: [
    { path: '/', route: homeRoute },
    { path: '/project/:project', route: projectRoute },
    { path: '/project/:project/stat', route: statRoute },
  ],
});
