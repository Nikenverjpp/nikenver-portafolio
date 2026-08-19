import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { environment } from '@env/environment';
import { SiteSettings } from '@core/models/site-settings.model';

@Injectable({ providedIn: 'root' })
export class SiteSettingsService {
  getSettings(): Observable<SiteSettings> {
    return of({
      name: environment.contact.name,
      email: environment.contact.email,
      phone: environment.contact.phone,
      phoneDisplay: environment.contact.phoneDisplay,
      linkedin: environment.contact.linkedin,
      hero_subtitle: 'Angular y Laravel en producción',
      hero_description: 'Más de 10 años construyendo aplicaciones web para empresas en Venezuela.',
      about_heading: 'Sobre mí',
      about_subtitle: 'Desarrollador Full Stack Angular y Laravel - Maracaibo, Venezuela',
      about_paragraph_1:
        'Soy Nikenver Pulgar, Ingeniero de Sistemas egresado de la Universidad Dr. José Gregorio Hernández en Maracaibo, Venezuela. Llevo más de 10 años desarrollando aplicaciones web full stack para empresas como Grupo Cobeca, C.A. Diario Panorama, Metro IT Service e Iconos Consultores, con Angular, Laravel, React, Vue.js y PHP.',
      about_paragraph_2:
        'También soy el fundador de Sublimax, un e-commerce de perfumería y variedades para el que construí Subladmin, su sistema administrativo a medida. Me especializo en front-end moderno con Angular y React, con un back-end sólido en Laravel y PHP como soporte.',
    });
  }
}
