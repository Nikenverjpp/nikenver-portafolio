import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Service } from '@core/models/service.model';
import servicesData from '@core/data/services.data.json';

const services = servicesData as Service[];

@Injectable({ providedIn: 'root' })
export class ServiceService {
  list(): Observable<Service[]> {
    return of([...services].sort((a, b) => a.sort_order - b.sort_order));
  }
}
