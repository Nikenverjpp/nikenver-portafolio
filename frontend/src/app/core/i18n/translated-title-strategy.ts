import { Injectable, inject } from '@angular/core';
import { RouterStateSnapshot, TitleStrategy } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { LocaleService } from './locale.service';
import { UI_STRINGS } from './translations';

/**
 * Route `title` values are treated as UI_STRINGS keys (not literal text), so the
 * browser tab title stays in sync with the active locale — including when the
 * locale changes without a navigation (see AppComponent, which calls `apply()`
 * again on every locale change).
 */
@Injectable({ providedIn: 'root' })
export class TranslatedTitleStrategy extends TitleStrategy {
  private readonly title = inject(Title);
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
    if (!key) {
      return;
    }
    const entry = UI_STRINGS[key];
    this.title.setTitle(entry ? entry[this.locale.locale()] : key);
  }
}
