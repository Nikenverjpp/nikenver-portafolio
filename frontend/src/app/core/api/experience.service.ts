import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Experience } from '@core/models/experience.model';
import experiencesData from '@core/data/experiences.data.json';

const experiences = experiencesData as Experience[];

@Injectable({ providedIn: 'root' })
export class ExperienceService {
  list(): Observable<Experience[]> {
    return of([...experiences].sort((a, b) => a.sort_order - b.sort_order));
  }
}
