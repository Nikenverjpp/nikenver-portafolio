import { Pipe, PipeTransform } from '@angular/core';
import { Locale } from './locale.service';
import { LocalizedText } from './localized-text.model';
import { UI_STRINGS } from './translations';

@Pipe({ name: 't', standalone: true, pure: true })
export class TranslatePipe implements PipeTransform {
  transform(value: string | LocalizedText | undefined | null, locale: Locale): string {
    if (value == null) {
      return '';
    }
    if (typeof value === 'object') {
      return value[locale] ?? value.es;
    }
    const entry = UI_STRINGS[value];
    if (!entry) {
      return value;
    }
    return entry[locale] ?? entry.es;
  }
}
