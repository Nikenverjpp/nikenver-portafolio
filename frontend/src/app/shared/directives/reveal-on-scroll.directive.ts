import { Directive, ElementRef, OnDestroy, OnInit, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

const SUPPORTS_SCROLL_DRIVEN_ANIMATIONS =
  typeof CSS !== 'undefined' &&
  CSS.supports('(animation-timeline: view()) and (animation-range: entry)');

@Directive({
  selector: '[appRevealOnScroll]',
  standalone: true,
  host: { class: 'reveal-on-scroll' },
})
export class RevealOnScrollDirective implements OnInit, OnDestroy {
  private readonly el = inject(ElementRef<HTMLElement>);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  private observer?: IntersectionObserver;

  ngOnInit(): void {
    // Modern browsers animate this purely in CSS (see .reveal-on-scroll in styles.css).
    // Older ones (e.g. Firefox) fall back to an IntersectionObserver-driven reveal.
    // Not applicable during prerendering, which has no window/IntersectionObserver.
    if (
      !this.isBrowser ||
      SUPPORTS_SCROLL_DRIVEN_ANIMATIONS ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      return;
    }

    const element = this.el.nativeElement;
    element.classList.add('reveal-on-scroll-fallback');

    this.observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          element.classList.add('is-visible');
          this.observer?.unobserve(element);
        }
      },
      { threshold: 0.15 }
    );

    this.observer.observe(element);
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
  }
}
