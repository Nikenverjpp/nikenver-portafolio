import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Project } from '../models/project.model';
import projectsData from '../data/projects.data.json';

const projects = projectsData as Project[];

@Injectable({ providedIn: 'root' })
export class ProjectService {
  list(): Observable<Project[]> {
    return of([...projects].sort((a, b) => a.sort_order - b.sort_order));
  }

  getBySlug(slug: string): Observable<Project | undefined> {
    return of(projects.find((p) => p.slug === slug));
  }
}
