import { Component, effect, inject, ChangeDetectionStrategy } from '@angular/core';
import { RouterOutlet, TitleStrategy } from '@angular/router';
import { ShellComponent } from './layout/shell.component';
import { ThemeService } from '@core/theme/theme.service';
import { LocaleService } from '@core/i18n/locale.service';
import { TranslatedTitleStrategy } from '@core/i18n/translated-title-strategy';
import { AnalyticsService } from '@core/analytics/analytics.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ShellComponent],
  changeDetection: ChangeDetectionStrategy.Eager,
  template: `
    <app-shell>
      <router-outlet />
    </app-shell>
  `,
})
export class AppComponent {
  // Injected so its effect (applying the [data-theme] attribute) runs from app bootstrap.
  private readonly theme = inject(ThemeService);
  // Injected so its constructor (appending the Umami script tag, prod-only) runs from app bootstrap.
  private readonly analytics = inject(AnalyticsService);
  private readonly locale = inject(LocaleService);
  private readonly titleStrategy = inject(TitleStrategy) as TranslatedTitleStrategy;

  constructor() {
    // Route titles are set on navigation; re-apply on locale change too, since
    // toggling the language doesn't itself trigger a navigation.
    effect(() => {
      this.locale.locale();
      this.titleStrategy.apply();
    });
  }
}
