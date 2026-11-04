import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { ProjectVideo } from '@core/models/project.model';
import { LocaleService } from '@core/i18n/locale.service';
import { TranslatePipe } from '@core/i18n/translate.pipe';

/** Plays a vertical clip inside a phone frame. Loads nothing until the visitor presses play. */
@Component({
  selector: 'app-phone-video',
  standalone: true,
  imports: [TranslatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <figure>
      <div class="relative rounded-[2.5rem] border border-white/15 bg-[#0d1117] p-2.5 shadow-xl">
        <span class="pointer-events-none absolute left-1/2 top-4 z-10 h-4 w-16 -translate-x-1/2 rounded-full bg-[#0d1117]" aria-hidden="true"></span>
        <span class="absolute -right-0.5 top-24 h-12 w-0.5 rounded-r bg-white/25" aria-hidden="true"></span>
        <span class="absolute -left-0.5 top-20 h-8 w-0.5 rounded-l bg-white/25" aria-hidden="true"></span>
        <span class="absolute -left-0.5 top-32 h-8 w-0.5 rounded-l bg-white/25" aria-hidden="true"></span>
        <video
          class="block aspect-[9/16] w-full rounded-[2rem] bg-white"
          width="720"
          height="1280"
          controls
          playsinline
          preload="none"
          [poster]="video().poster"
          [attr.aria-label]="video().title | t: locale.locale()"
          (play)="pauseOthers($event)"
        >
          <source [src]="video().src" type="video/mp4" />
        </video>
      </div>
      <figcaption class="mt-3 text-center">
        <span class="block font-display text-sm font-semibold text-text-primary">{{ video().title | t: locale.locale() }}</span>
        <span class="mt-1 block font-sans text-xs text-text-muted">{{ video().caption | t: locale.locale() }}</span>
      </figcaption>
    </figure>
  `,
})
export class PhoneVideoComponent {
  readonly video = input.required<ProjectVideo>();
  readonly locale = inject(LocaleService);

  pauseOthers(event: Event): void {
    const current = event.target as HTMLVideoElement;
    current.ownerDocument.querySelectorAll('video').forEach((other) => {
      if (other !== current) other.pause();
    });
  }
}
