import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { environment } from '@env/environment';

@Injectable({ providedIn: 'root' })
export class AnalyticsService {
  constructor() {
    const isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
    const websiteId = environment.analyticsWebsiteId;
    if (!isBrowser || !websiteId) {
      return;
    }

    const script = document.createElement('script');
    script.defer = true;
    script.src = 'https://cloud.umami.is/script.js';
    script.setAttribute('data-website-id', websiteId);
    document.head.appendChild(script);
  }
}
