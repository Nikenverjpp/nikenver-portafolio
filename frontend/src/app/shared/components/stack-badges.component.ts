import { Component, Input, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-stack-badges',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.Eager,
  template: `
    <div class="mb-4 flex flex-wrap gap-2">
      @for (item of items; track item) {
        <span
          class="rounded-md border border-border bg-bg-elevated px-2.5 py-1 font-mono text-xs text-text-secondary"
        >
          {{ item }}
        </span>
      }
    </div>
  `,
})
export class StackBadgesComponent {
  @Input({ required: true }) items: string[] = [];
}

