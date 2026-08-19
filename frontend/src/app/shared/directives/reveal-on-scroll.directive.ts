import { Directive, ElementRef, Input, OnDestroy, OnInit, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

let sharedObserver: IntersectionObserver | undefined;
const revealCallbacks = new WeakMap<Element, () => void>();

function getSharedObserver(): IntersectionObserver {
  if (!sharedObserver) {
    sharedObserver = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            revealCallbacks.get(entry.target)?.();
            revealCallbacks.delete(entry.target);
            sharedObserver?.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.15 }
    );
  }
  return sharedObserver;
}

@Directive({
  selector: '[appRevealOnScroll]',
  standalone: true,
})
export class RevealOnScrollDirective implements OnInit, OnDestroy {
  @Input('appRevealOnScroll') animation = 'fadeInUp';

  private readonly el = inject(ElementRef<HTMLElement>);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  private observing = false;

  ngOnInit(): void {
    if (!this.isBrowser || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    let observer: IntersectionObserver;
    try {
      observer = getSharedObserver();
    } catch {
      // IntersectionObserver unavailable: leave the element visible rather than
      // hiding it behind an animation that can never fire.
      return;
    }

    const element = this.el.nativeElement;
    const animationName = this.animation.trim() || 'fadeInUp';
    element.style.setProperty('--animate-duration', '0.8s');
    element.classList.add('opacity-0');
    revealCallbacks.set(element, () => {
      element.classList.remove('opacity-0');
      element.classList.add('animate__animated', `animate__${animationName}`);
    });
    observer.observe(element);
    this.observing = true;
  }

  ngOnDestroy(): void {
    if (!this.observing) {
      return;
    }
    const element = this.el.nativeElement;
    revealCallbacks.delete(element);
    sharedObserver?.unobserve(element);
  }
}
