import { Component, Input, inject, ChangeDetectionStrategy } from '@angular/core';
import { Experience } from '../../core/models/experience.model';
import { StackBadgesComponent } from './stack-badges.component';
import { LocaleService } from '../../core/i18n/locale.service';
import { TranslatePipe } from '../../core/i18n/translate.pipe';

@Component({
  selector: 'app-timeline-item',
  standalone: true,
  imports: [StackBadgesComponent, TranslatePipe],
  changeDetection: ChangeDetectionStrategy.Eager,
  template: `
    <div class="relative border-l border-border pl-6 pb-10 last:pb-0">
      <span
        class="absolute -left-[5px] top-1 h-2.5 w-2.5 rounded-full bg-accent-cyan shadow-[0_0_12px_#00D9FF80]"
      ></span>
      <p class="font-mono text-xs text-text-muted">
        {{ period() }}
      </p>
      <h3 class="mt-1 font-display text-lg font-semibold text-text-primary">
        {{ experience.role | t: locale.locale() }}
      </h3>
      <p class="text-accent-cyan">{{ experience.company }}</p>
      @if (experience.description) {
        <p class="mt-2 text-sm leading-relaxed text-text-secondary">
          {{ experience.description | t: locale.locale() }}
        </p>
      }
      @if (experience.stack?.length) {
        <app-stack-badges [items]="experience.stack!" class="mt-3 block" />
      }
      @if (experience.links?.length) {
        <p class="mt-3 mb-3 flex flex-wrap gap-3 text-sm">
          @for (link of experience.links; track link.url) {
            <a
              [href]="link.url"
              target="_blank"
              rel="noopener noreferrer"
              class="inline-flex items-center gap-1 text-accent-cyan hover:underline"
            >
              {{ link.label | t: locale.locale() }}
              <span class="material-symbols-outlined !text-sm" aria-hidden="true">open_in_new</span>
            </a>
          }
        </p>
      }
    </div>
  `,
})
export class TimelineItemComponent {
  @Input({ required: true }) experience!: Experience;
  readonly locale = inject(LocaleService);

  period(): string {
    const start = this.experience.start_year ?? '';
    const end = this.experience.end_year ?? this.present();
    return `${start} - ${end}`;
  }

  private present(): string {
    return this.locale.locale() === 'en' ? 'Present' : 'Presente';
  }
}
