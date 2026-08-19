import { RenderMode, ServerRoute } from '@angular/ssr';
import projectsData from '@core/data/projects.data.json';

export const serverRoutes: ServerRoute[] = [
  {
    path: 'proyectos/:slug',
    renderMode: RenderMode.Prerender,
    async getPrerenderParams() {
      return projectsData.map((project) => ({ slug: project.slug }));
    },
  },
  {
    path: '**',
    renderMode: RenderMode.Prerender,
  },
];
