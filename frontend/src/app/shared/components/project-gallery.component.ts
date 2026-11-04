import { ChangeDetectionStrategy, Component, ElementRef, computed, inject, input, signal, viewChild } from '@angular/core';
import { ProjectImage } from '@core/models/project.model';
import { LocaleService } from '@core/i18n/locale.service';
import { TranslatePipe } from '@core/i18n/translate.pipe';

/** Screenshot grid. Each image opens in a modal, so visitors stay on the case study. */
@Component({
  selector: 'app-project-gallery',
  standalone: true,
  imports: [TranslatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="grid gap-4 sm:grid-cols-2">
      @for (image of images(); track image.src; let index = $index) {
        <figure>
          <button
            type="button"
            class="card-surface block w-full cursor-zoom-in overflow-hidden"
            [attr.aria-label]="('projects.galleryOpen' | t: locale.locale()) + ': ' + (image.alt | t: locale.locale())"
            (click)="open(index)"
          >
            <img
              [src]="image.src"
              [alt]="image.alt | t: locale.locale()"
              [attr.width]="image.width"
              [attr.height]="image.height"
              loading="lazy"
              decoding="async"
              class="h-auto w-full"
            />
          </button>
          <figcaption class="mt-2 font-sans text-xs text-text-muted">{{ image.caption | t: locale.locale() }}</figcaption>
        </figure>
      }
    </div>

    <dialog
      #dialog
      class="m-auto w-[min(94vw,72rem)] max-w-none bg-transparent p-0 backdrop:bg-black/85"
      [attr.aria-label]="'projects.detailGallery' | t: locale.locale()"
      (click)="closeOnBackdrop($event)"
      (keydown)="onKeydown($event)"
      (close)="current.set(null)"
    >
      @if (currentImage(); as image) {
        <div class="flex items-center justify-between gap-4 pb-3 text-white">
          <p class="font-sans text-sm">
            @if (images().length > 1) {
              <span class="mr-2 text-white/60">{{ current()! + 1 }} / {{ images().length }}</span>
            }
            {{ image.caption | t: locale.locale() }}
          </p>
          <button
            type="button"
            class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/10 hover:bg-white/20"
            [attr.aria-label]="'projects.galleryClose' | t: locale.locale()"
            (click)="close()"
          >
            <span class="material-symbols-outlined" aria-hidden="true">close</span>
          </button>
        </div>
        <div class="relative">
          <img
            [src]="image.src"
            [alt]="image.alt | t: locale.locale()"
            [attr.width]="image.width"
            [attr.height]="image.height"
            class="mx-auto h-auto max-h-[80vh] w-auto max-w-full rounded-lg object-contain"
          />
          @if (images().length > 1) {
            <button
              type="button"
              class="absolute left-2 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-black/70 text-white hover:bg-black/90"
              [attr.aria-label]="'projects.galleryPrevious' | t: locale.locale()"
              (click)="move(-1)"
            >
              <span class="material-symbols-outlined" aria-hidden="true">chevron_left</span>
            </button>
            <button
              type="button"
              class="absolute right-2 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-black/70 text-white hover:bg-black/90"
              [attr.aria-label]="'projects.galleryNext' | t: locale.locale()"
              (click)="move(1)"
            >
              <span class="material-symbols-outlined" aria-hidden="true">chevron_right</span>
            </button>
          }
        </div>
      }
    </dialog>
  `,
})
export class ProjectGalleryComponent {
  readonly images = input.required<ProjectImage[]>();
  readonly locale = inject(LocaleService);
  readonly current = signal<number | null>(null);
  readonly currentImage = computed(() => {
    const index = this.current();
    return index === null ? null : this.images()[index];
  });

  private readonly dialog = viewChild.required<ElementRef<HTMLDialogElement>>('dialog');

  open(index: number): void {
    this.current.set(index);
    this.dialog().nativeElement.showModal();
  }

  close(): void {
    this.dialog().nativeElement.close();
  }

  move(step: number): void {
    const total = this.images().length;
    this.current.update((index) => ((index ?? 0) + step + total) % total);
  }

  closeOnBackdrop(event: MouseEvent): void {
    if (event.target === this.dialog().nativeElement) this.close();
  }

  onKeydown(event: KeyboardEvent): void {
    if (event.key === 'ArrowLeft') this.move(-1);
    if (event.key === 'ArrowRight') this.move(1);
  }
}
