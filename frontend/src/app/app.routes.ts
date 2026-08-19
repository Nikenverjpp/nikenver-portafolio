import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('@features/home/home.component').then((m) => m.HomeComponent),
    title: 'title.home',
    data: { description: 'meta.home' },
  },
  {
    path: 'sobre-mi',
    loadComponent: () => import('@features/about/about.component').then((m) => m.AboutComponent),
    title: 'title.about',
    data: { description: 'meta.about' },
  },
  {
    path: 'proyectos',
    loadComponent: () =>
      import('@features/projects/projects-list.component').then((m) => m.ProjectsListComponent),
    title: 'title.projects',
    data: { description: 'meta.projects' },
  },
  {
    path: 'proyectos/:slug',
    loadComponent: () =>
      import('@features/projects/project-detail.component').then((m) => m.ProjectDetailComponent),
    // Dynamic per-project title and description are set by ProjectDetailComponent itself.
  },
  {
    path: 'contacto',
    loadComponent: () =>
      import('@features/contact/contact.component').then((m) => m.ContactComponent),
    title: 'title.contact',
    data: { description: 'meta.contact' },
  },
  {
    path: '**',
    loadComponent: () => import('@components/not-found.component').then((m) => m.NotFoundComponent),
    title: 'title.notFound',
    data: { description: 'meta.notFound' },
  },
];

