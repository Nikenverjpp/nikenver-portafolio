import { DOCUMENT } from '@angular/common';
import { Injectable, inject } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, TitleStrategy } from '@angular/router';
import { Meta, Title } from '@angular/platform-browser';
import { LocaleService } from './locale.service';
import { UI_STRINGS } from './translations';

const SITE_ORIGIN = 'https://nikenver-portafolio.vercel.app';

/**
 * Route `title` values (and the `description` route data key) are treated as
 * UI_STRINGS keys (not literal text), so the tab title and meta description
 * stay in sync with the active locale — including when the locale changes
 * without a navigation (see AppComponent, which calls `apply()` again on
 * every locale change).
 */
@Injectable({ providedIn: 'root' })
export class TranslatedTitleStrategy extends TitleStrategy {
  private readonly title = inject(Title);
  private readonly meta = inject(Meta);
  private readonly document = inject(DOCUMENT);
  private readonly locale = inject(LocaleService);
  private lastSnapshot?: RouterStateSnapshot;

  override updateTitle(snapshot: RouterStateSnapshot): void {
    this.lastSnapshot = snapshot;
    this.apply();
  }

  apply(): void {
    if (!this.lastSnapshot) {
      return;
    }
    const key = this.buildTitle(this.lastSnapshot);
    if (key) {
      const entry = UI_STRINGS[key];
      const title = entry ? entry[this.locale.locale()] : key;
      this.title.setTitle(title);
      this.meta.updateTag({ property: 'og:title', content: title });
      this.meta.updateTag({ name: 'twitter:title', content: title });
    }

    const descriptionKey = this.deepestSnapshot(this.lastSnapshot.root).data['description'] as
      | string
      | undefined;
    if (descriptionKey) {
      const entry = UI_STRINGS[descriptionKey];
      const description = entry ? entry[this.locale.locale()] : descriptionKey;
      this.meta.updateTag({ name: 'description', content: description });
      this.meta.updateTag({ property: 'og:description', content: description });
      this.meta.updateTag({ name: 'twitter:description', content: description });
    }

    this.updateCanonical(this.lastSnapshot.url);
  }

  private updateCanonical(path: string): void {
    const href = `${SITE_ORIGIN}${path === '/' ? '' : path}`;
    let link = this.document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!link) {
      link = this.document.createElement('link');
      link.setAttribute('rel', 'canonical');
      this.document.head.appendChild(link);
    }
    link.setAttribute('href', href);
    this.meta.updateTag({ property: 'og:url', content: href });
  }

  private deepestSnapshot(route: ActivatedRouteSnapshot): ActivatedRouteSnapshot {
    let current = route;
    while (current.firstChild) {
      current = current.firstChild;
    }
    return current;
  }
}
