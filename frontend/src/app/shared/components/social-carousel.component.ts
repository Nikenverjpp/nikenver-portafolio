import { Component, Input, inject, ChangeDetectionStrategy } from '@angular/core';
import { SocialPost } from '@core/models/social-post.model';
import { LocaleService } from '@core/i18n/locale.service';
import { TranslatePipe } from '@core/i18n/translate.pipe';

/**
 * A row of link-out cards to curated Instagram/TikTok posts.
 *
 * This deliberately does NOT use the platforms' live iframe embeds: both
 * Instagram's and TikTok's embed.js rely on a postMessage handshake to size
 * their iframe after load, and in testing that handshake reliably failed
 * (iframe collapsed to ~1px tall) both in automation and in a real browser.
 * A plain link card has no such failure mode.
 *
 * "Approving" a post is just adding its URL to the project's `socialPosts`
 * array in projects.json — no plugin, no API keys, no dashboard.
 */
@Component({
  selector: 'app-social-carousel',
  standalone: true,
  imports: [TranslatePipe],
  changeDetection: ChangeDetectionStrategy.Eager,
  template: `
    <div class="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2">
      @for (post of posts; track post.url) {
        <a
          [href]="post.url"
          target="_blank"
          rel="noopener noreferrer"
          class="card-surface flex w-[220px] shrink-0 snap-start flex-col gap-3 border-l-4 p-5 transition-all hover:-translate-y-1"
          [class.border-l-accent-violet]="post.platform === 'instagram'"
          [class.border-l-border]="post.platform === 'tiktok'"
        >
          <span class="font-sans text-xs uppercase tracking-wide text-text-muted">
            {{ post.platform === 'instagram' ? 'Instagram' : 'TikTok' }}
          </span>
          <span class="font-display text-lg font-semibold text-text-primary">{{ '@sublimaxss_' }}</span>
          <span class="mt-auto inline-flex items-center gap-1 text-sm font-medium text-accent-cyan">
            {{ 'social.viewPost' | t: locale.locale() }}
            <span class="material-symbols-outlined !text-base" aria-hidden="true">open_in_new</span>
          </span>
        </a>
      }
    </div>
  `,
})
export class SocialCarouselComponent {
  @Input({ required: true }) posts: SocialPost[] = [];
  readonly locale = inject(LocaleService);
}
