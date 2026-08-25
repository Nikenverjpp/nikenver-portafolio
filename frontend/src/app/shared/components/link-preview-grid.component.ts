import { Component, Input, inject, ChangeDetectionStrategy } from '@angular/core';
import { NamedLink } from '@core/i18n/localized-text.model';
import { LocaleService } from '@core/i18n/locale.service';
import { TranslatePipe } from '@core/i18n/translate.pipe';

@Component({
  selector: 'app-link-preview-grid',
  standalone: true,
  imports: [TranslatePipe],
  changeDetection: ChangeDetectionStrategy.Eager,
  template: `
    <div class="grid grid-cols-1 gap-3 sm:grid-cols-3">
      @for (link of links; track link.url) {
        <a
          [href]="link.url"
          target="_blank"
          rel="noopener noreferrer"
          class="card-surface group flex flex-col overflow-hidden transition-all hover:-translate-y-0.5 hover:border-accent-cyan/40"
        >
          @if (link.preview_image_url) {
            <span class="block h-20 w-full overflow-hidden bg-bg-primary">
              <img
                [src]="link.preview_image_url"
                [alt]="''"
                aria-hidden="true"
                width="640"
                height="360"
                loading="lazy"
                decoding="async"
                class="h-full w-full object-cover object-center transition-transform duration-300 group-hover:scale-105"
              />
            </span>
          }
          <span
            class="flex items-center justify-between gap-1 px-3 py-2 text-xs font-medium text-text-secondary group-hover:text-accent-cyan"
          >
            {{ link.label | t: locale.locale() }}
            <span class="material-symbols-outlined !text-sm" aria-hidden="true">open_in_new</span>
          </span>
        </a>
      }
    </div>
  `,
})
export class LinkPreviewGridComponent {
  @Input({ required: true }) links!: NamedLink[];
  readonly locale = inject(LocaleService);
}
